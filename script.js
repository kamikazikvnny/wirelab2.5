/*
============================================================
WIRELAB
GFCI BRANCH CIRCUIT LAB
Main JavaScript Controller
============================================================

Sections:
1.  Global Variables
2.  DOM References
3.  Cable Type Helpers
4.  Toolbox Drag System
5.  Point Detection
6.  Drop Targets
7.  Junction Box Management
8.  Device Installation
9.  Cable Management
10. Appliance Power Cord
11. Cable Selection Menu
12. Lab Controls
13. Initialization
============================================================
*/


/* =========================================================
   1. GLOBAL VARIABLES
========================================================= */

const INITIAL_BOXES = [
    { number: 1, left: 90, top: 80 },
    { number: 2, left: 340, top: 80 },
    { number: 3, left: 590, top: 80 },
    { number: 4, left: 215, top: 285 },
    { number: 5, left: 465, top: 285 }
];


const BOX_DEVICE_TYPES = new Set([
    "duplex-receptacle",
    "half-hot-receptacle",
    "gfci",
    "single-pole-switch",
    "light-fixture"
]);


const DEVICE_NAMES = {
    "duplex-receptacle": "Duplex Receptacle",
    "half-hot-receptacle": "Half-Hot Receptacle",
    "gfci": "GFCI Receptacle",
    "single-pole-switch": "Single-Pole Switch",
    "light-fixture": "Light Fixture",
    "light-bulb": "Light Bulb"
};


/* =========================================================
   SELECTION STATE
========================================================= */

let selectedBox = null;
let selectedDevice = null;
let selectedPowerCord = null;
let selectedCable = null;


/* =========================================================
   CABLE STATE
========================================================= */

let installedCables = [];
let nextCableId = 1;
let cableDragState = null;

let selectedKnockout = null;
let cableMenu = null;


/* =========================================================
   DRAG STATE
========================================================= */

let dragState = null;
let toolboxDragType = null;


/* =========================================================
   ID COUNTERS
========================================================= */

let nextBoxNumber = 6;
let nextDeviceId = 1;


/* =========================================================
   2. DOM REFERENCES
========================================================= */

const workboard =
    document.getElementById("workboard");

const junctionBoxesLayer =
    document.getElementById("junctionBoxes");

const messageEl =
    document.getElementById("message");

const powerCordLayer =
    document.getElementById("powerCordLayer");

const addBoxButton =
    document.getElementById("addBox");

const removeBoxButton =
    document.getElementById("removeBox");

const resetLabButton =
    document.getElementById("resetLab");


/* =========================================================
   3. CABLE TYPE HELPERS
========================================================= */

function normalizeCableType(type) {

    if (!type) {
        return null;
    }


    const normalized =
        String(type)
            .trim()
            .toLowerCase();


    if (
        normalized === "14/2-wire" ||
        normalized === "14/2 - wire cable" ||
        normalized === "14-2-nmb" ||
        normalized === "14-2-wire"
    ) {
        return "14-2-nmb";
    }


    if (
        normalized === "14/3-wire" ||
        normalized === "14/3 - wire cable" ||
        normalized === "14-3-nmb" ||
        normalized === "14-3-wire"
    ) {
        return "14-3-nmb";
    }


    return normalized;
}


function is14_2Cable(type) {

    return (
        normalizeCableType(type) ===
        "14-2-nmb"
    );
}


function is14_3Cable(type) {

    return (
        normalizeCableType(type) ===
        "14-3-nmb"
    );
}


function cableDisplayName(type) {

    return is14_3Cable(type)
        ? "14/3 NMB cable"
        : "14/2 NMB cable";
}


/* =========================================================
   4. TOOLBOX DRAG SYSTEM
========================================================= */

function bindToolboxDrag() {

    document
        .querySelectorAll("#toolbox .component")
        .forEach((component) => {

            component.addEventListener(
                "dragstart",
                onComponentDragStart
            );

            component.addEventListener(
                "dragend",
                onComponentDragEnd
            );
        });


    workboard?.addEventListener(
        "dragover",
        onWorkboardDragOver
    );


    workboard?.addEventListener(
        "drop",
        onWorkboardDrop
    );


    workboard?.addEventListener(
        "dragleave",
        onWorkboardDragLeave
    );
}


function onComponentDragStart(event) {

    const component =
        event.currentTarget;


    toolboxDragType =
        normalizeCableType(
            component.dataset.component
        );


    component.classList.add(
        "dragging"
    );


    event.dataTransfer.effectAllowed =
        "copy";


    event.dataTransfer.setData(
        "text/plain",
        toolboxDragType
    );
}


function onComponentDragEnd(event) {

    event.currentTarget.classList.remove(
        "dragging"
    );


    toolboxDragType = null;

    clearDropTargets();
}


function onWorkboardDragOver(event) {

    if (!toolboxDragType) {
        return;
    }


    event.preventDefault();


    event.dataTransfer.dropEffect =
        "copy";


    updateDropTarget(
        event.clientX,
        event.clientY
    );
}


function onWorkboardDragLeave(event) {

    if (
        !workboard.contains(
            event.relatedTarget
        )
    ) {

        clearDropTargets();
    }
}


function onWorkboardDrop(event) {

    event.preventDefault();


    const type =
        normalizeCableType(
            toolboxDragType ||
            event.dataTransfer.getData(
                "text/plain"
            )
        );


    clearDropTargets();


    if (!type) {
        return;
    }


    /* -----------------------------------------------------
       LIGHT BULB
    ----------------------------------------------------- */

    if (type === "light-bulb") {

        installBulbAtPoint(
            event.clientX,
            event.clientY
        );

        return;
    }


    /* -----------------------------------------------------
       WIRING DEVICES
    ----------------------------------------------------- */

    if (BOX_DEVICE_TYPES.has(type)) {

        const box =
            getBoxAtPoint(
                event.clientX,
                event.clientY
            );


        if (!box) {

            setMessage(
                "Drop the device onto a junction box to install it."
            );

            return;
        }


        installDeviceInBox(
            type,
            box
        );

        return;
    }


    /* -----------------------------------------------------
       3-PRONG APPLIANCE POWER CORD
    ----------------------------------------------------- */

    if (
        type ===
        "appliance-power-cord"
    ) {

        const knockout =
            getKnockoutAtPoint(
                event.clientX,
                event.clientY
            );


        if (!knockout) {

            setMessage(
                "Drop the 3-prong power cord onto a knockout opening."
            );

            return;
        }


        connectPowerCordToKnockout(
            knockout
        );

        return;
    }


    /* -----------------------------------------------------
       NMB CABLE
    ----------------------------------------------------- */

    if (
        is14_2Cable(type) ||
        is14_3Cable(type)
    ) {

        const knockout =
            getKnockoutAtPoint(
                event.clientX,
                event.clientY
            );


        if (!knockout) {

            setMessage(
                "Drop the NMB cable onto a knockout opening."
            );

            return;
        }


        startCableConnection(
            type,
            knockout
        );
    }
}


/* =========================================================
   5. POINT DETECTION
========================================================= */

function getBoxAtPoint(x, y) {

    const element =
        document.elementFromPoint(x, y);


    return element
        ? element.closest(".junction-box")
        : null;
}


function getKnockoutAtPoint(x, y) {

    const element =
        document.elementFromPoint(x, y);


    return element
        ? element.closest(".knockout")
        : null;
}


function getFixtureAtPoint(x, y) {

    const element =
        document.elementFromPoint(x, y);


    if (!element) {
        return null;
    }


    return (
        element.closest(
            ".light-fixture-device"
        ) ||
        element
            .closest(".junction-box")
            ?.querySelector(
                ".light-fixture-device"
            )
    );
}


/* =========================================================
   6. DROP TARGET SYSTEM
========================================================= */

function updateDropTarget(x, y) {

    clearDropTargets();


    /* -----------------------------------------------------
       POWER CORD
    ----------------------------------------------------- */

    if (
        toolboxDragType ===
        "appliance-power-cord"
    ) {

        const knockout =
            getKnockoutAtPoint(x, y);


        knockout?.classList.add(
            "drop-target"
        );

        return;
    }


    /* -----------------------------------------------------
       NMB CABLE
    ----------------------------------------------------- */

    if (
        is14_2Cable(toolboxDragType) ||
        is14_3Cable(toolboxDragType)
    ) {

        const knockout =
            getKnockoutAtPoint(x, y);


        knockout?.classList.add(
            "drop-target"
        );

        return;
    }


    /* -----------------------------------------------------
       LIGHT BULB
    ----------------------------------------------------- */

    if (
        toolboxDragType ===
        "light-bulb"
    ) {

        const fixture =
            getFixtureAtPoint(x, y);


        fixture?.classList.add(
            "drop-target"
        );


        fixture
            ?.closest(".junction-box")
            ?.classList.add(
                "drop-target"
            );


        return;
    }


    /* -----------------------------------------------------
       WIRING DEVICE
    ----------------------------------------------------- */

    if (
        !BOX_DEVICE_TYPES.has(
            toolboxDragType
        )
    ) {
        return;
    }


    const box =
        getBoxAtPoint(x, y);


    if (
        box &&
        !getInstalledDevice(box)
    ) {

        box.classList.add(
            "drop-target"
        );
    }
}


function clearDropTargets() {

    document
        .querySelectorAll(".drop-target")
        .forEach((element) => {

            element.classList.remove(
                "drop-target"
            );
        });
}


/* =========================================================
   7. JUNCTION BOX MANAGEMENT
========================================================= */

function setMessage(text) {

    if (messageEl) {
        messageEl.textContent = text;
    }
}


function boxLabel(box) {

    return (
        box
            ?.querySelector(".box-label")
            ?.textContent
            .trim() ||
        "J-Box"
    );
}


function getBoxRotation(box) {

    return Number(
        box.dataset.rotation || 0
    );
}


function applyBoxTransform(box) {

    box.style.transform =
        `rotate(${getBoxRotation(box)}deg)`;
}


/* =========================================================
   BOX SELECTION
========================================================= */

function selectBox(box) {

    document
        .querySelectorAll(
            ".junction-box.selected"
        )
        .forEach((element) => {

            element.classList.remove(
                "selected"
            );
        });


    selectedBox = box;


    if (!box) {
        return;
    }


    box.classList.add(
        "selected"
    );


    if (
        !selectedDevice &&
        !selectedPowerCord &&
        !selectedCable
    ) {

        setMessage(
            `${boxLabel(box)} selected. Drag to reposition.`
        );
    }
}


function selectDevice(device) {

    document
        .querySelectorAll(
            ".installed-device.selected"
        )
        .forEach((element) => {

            element.classList.remove(
                "selected"
            );
        });


    clearPowerCordSelection();
    clearCableSelection();


    selectedDevice = device;


    if (!device) {
        return;
    }


    device.classList.add(
        "selected"
    );


    const box =
        device.closest(
            ".junction-box"
        );


    if (box) {
        selectBox(box);
    }


    setMessage(
        `${deviceName(device)} selected.`
    );
}


function selectPowerCord(cord) {

    document
        .querySelectorAll(
            ".installed-device.selected"
        )
        .forEach((element) => {

            element.classList.remove(
                "selected"
            );
        });


    clearCableSelection();
    clearPowerCordSelection();


    selectedDevice = null;
    selectedPowerCord = cord;


    if (!cord) {
        return;
    }


    cord.classList.add(
        "selected"
    );


    const box =
        cord
            ._connectedKnockout
            ?.closest(
                ".junction-box"
            );


    if (box) {
        selectBox(box);
    }


    setMessage(
        "3-prong appliance power cord selected."
    );
}


function clearDeviceSelection() {

    document
        .querySelectorAll(
            ".installed-device.selected"
        )
        .forEach((element) => {

            element.classList.remove(
                "selected"
            );
        });


    selectedDevice = null;
}


function clearPowerCordSelection() {

    document
        .querySelectorAll(
            ".appliance-power-cord-installed.selected"
        )
        .forEach((element) => {

            element.classList.remove(
                "selected"
            );
        });


    selectedPowerCord = null;
}


/* =========================================================
   BOX MOVEMENT
========================================================= */

function clamp(
    value,
    min,
    max
) {

    return Math.min(
        max,
        Math.max(min, value)
    );
}


function moveBox(
    box,
    left,
    top
) {

    if (!workboard || !box) {
        return;
    }


    const maxLeft =
        Math.max(
            0,
            workboard.clientWidth -
            box.offsetWidth
        );


    const maxTop =
        Math.max(
            0,
            workboard.clientHeight -
            box.offsetHeight
        );


    box.style.left =
        `${clamp(left, 0, maxLeft)}px`;


    box.style.top =
        `${clamp(top, 0, maxTop)}px`;
}


/* =========================================================
   KNOCKOUT MARKUP
========================================================= */

function knockoutMarkup() {

    return `
        <div class="knockout knockout-top"
             data-position="top"></div>

        <div class="knockout knockout-bottom"
             data-position="bottom"></div>

        <div class="knockout knockout-left"
             data-position="left"></div>

        <div class="knockout knockout-right"
             data-position="right"></div>
    `;
}


/* =========================================================
   CREATE JUNCTION BOX
========================================================= */

function createJunctionBox(
    number,
    left,
    top
) {

    const box =
        document.createElement("div");


    box.className =
        "junction-box";


    box.id =
        `box${number}`;


    box.dataset.box =
        String(number);


    box.dataset.rotation =
        "0";


    box.style.left =
        `${left}px`;


    box.style.top =
        `${top}px`;


    box.innerHTML = `
        <div class="box-label">
            J-BOX ${number}
        </div>

        ${knockoutMarkup()}
    `;


    junctionBoxesLayer.appendChild(
        box
    );


    attachBoxEvents(box);


    return box;
}


/* =========================================================
   ATTACH JUNCTION BOX EVENTS
========================================================= */

function attachBoxEvents(box) {

    box.dataset.rotation =
        box.dataset.rotation || "0";


    applyBoxTransform(box);


    box.addEventListener(
        "pointerdown",
        onBoxPointerDown
    );


    box.addEventListener(
        "dragstart",
        (event) => {

            if (
                !event.target.closest(
                    ".installed-device"
                )
            ) {

                event.preventDefault();
            }
        }
    );
}


/* =========================================================
   JUNCTION BOX POINTER DOWN
========================================================= */

function onBoxPointerDown(event) {

    if (event.button !== 0) {
        return;
    }


    /* -----------------------------------------------------
       CABLE CONNECTION
    ----------------------------------------------------- */

    if (cableDragState) {

        const knockout =
            event.target.closest(
                ".knockout"
            );


        if (knockout) {

            event.preventDefault();
            event.stopPropagation();


            clearCableDropTargets();


            finishCableConnection(
                knockout
            );
        }


        return;
    }


    /* -----------------------------------------------------
       POWER CORD
    ----------------------------------------------------- */

    const powerCord =
        event.target.closest(
            ".appliance-power-cord-installed"
        );


    if (powerCord) {

        selectPowerCord(
            powerCord
        );


        event.stopPropagation();

        return;
    }


    /* -----------------------------------------------------
       DEVICE
    ----------------------------------------------------- */

    const device =
        event.target.closest(
            ".installed-device"
        );


    if (device) {

        selectDevice(
            device
        );


        event.stopPropagation();

        return;
    }


    /* -----------------------------------------------------
       KNOCKOUT
    ----------------------------------------------------- */

    if (
        event.target.classList.contains(
            "knockout"
        )
    ) {

        clearDeviceSelection();
        clearPowerCordSelection();
        clearCableSelection();


        selectBox(
            event.currentTarget
        );


        showCableMenu(
            event.target
        );


        event.preventDefault();
        event.stopPropagation();

        return;
    }


    /* -----------------------------------------------------
       JUNCTION BOX
    ----------------------------------------------------- */

    const box =
        event.currentTarget;


    clearDeviceSelection();
    clearPowerCordSelection();
    clearCableSelection();


    selectBox(box);


    dragState = {

        box,

        pointerId:
            event.pointerId,

        startX:
            event.clientX,

        startY:
            event.clientY,

        startLeft:
            box.offsetLeft,

        startTop:
            box.offsetTop,

        moved: false
    };


    box.setPointerCapture(
        event.pointerId
    );


    event.preventDefault();
}


/* =========================================================
   POINTER MOVE
========================================================= */

function onPointerMove(event) {

    /* -----------------------------------------------------
       CABLE CONNECTION
    ----------------------------------------------------- */

    if (cableDragState) {

        onCablePointerMove(
            event
        );

        return;
    }


    /* -----------------------------------------------------
       JUNCTION BOX
    ----------------------------------------------------- */

    if (
        !dragState ||
        event.pointerId !==
        dragState.pointerId
    ) {
        return;
    }


    const dx =
        event.clientX -
        dragState.startX;


    const dy =
        event.clientY -
        dragState.startY;


    if (
        Math.abs(dx) > 2 ||
        Math.abs(dy) > 2
    ) {

        dragState.moved = true;
    }


    moveBox(
        dragState.box,
        dragState.startLeft + dx,
        dragState.startTop + dy
    );


    updateAllCablePositions();
}


/* =========================================================
   POINTER UP
========================================================= */

function onPointerUp(event) {

    if (cableDragState) {

        onCablePointerUp(
            event
        );

        return;
    }


    if (
        !dragState ||
        event.pointerId !==
        dragState.pointerId
    ) {
        return;
    }


    try {

        dragState.box.releasePointerCapture(
            dragState.pointerId
        );

    } catch (error) {

        /* Pointer capture may already be released. */
    }


    if (dragState.moved) {

        setMessage(
            `${boxLabel(dragState.box)} moved.`
        );
    }


    dragState = null;
}


/* =========================================================
   ADD JUNCTION BOX
========================================================= */

function addJunctionBox() {

    const offset =
        ((nextBoxNumber - 6) % 5) *
        24;


    const box =
        createJunctionBox(
            nextBoxNumber,
            40 + offset,
            160 + offset
        );


    nextBoxNumber += 1;


    selectBox(box);


    setMessage(
        `${boxLabel(box)} added.`
    );
}


/* =========================================================
   REMOVE SELECTED JUNCTION BOX
========================================================= */

function removeSelectedBox() {

    if (!selectedBox) {

        setMessage(
            "Select a junction box first."
        );

        return;
    }


    const name =
        boxLabel(selectedBox);


    removeCablesConnectedToBox(
        selectedBox
    );


    if (
        cableDragState?.cable?.startKnockout
            ?.closest(".junction-box") ===
        selectedBox
    ) {

        cancelCableConnection();
    }


    if (
        selectedPowerCord?._connectedKnockout
            ?.closest(".junction-box") ===
        selectedBox
    ) {

        removePowerCord(
            selectedPowerCord
        );
    }


    selectedBox.remove();


    selectedBox = null;
    selectedDevice = null;
    selectedPowerCord = null;
    selectedCable = null;


    setMessage(
        `${name} removed.`
    );
}


/* =========================================================
   RESET JUNCTION BOXES
========================================================= */

function resetJunctionBoxes() {

    junctionBoxesLayer.innerHTML =
        "";


    if (powerCordLayer) {

        powerCordLayer.innerHTML =
            "";
    }


    const cableLayer =
        document.getElementById(
            "cableLayer"
        );


    if (cableLayer) {

        cableLayer.innerHTML =
            "";


        cableLayer.style.pointerEvents =
            "none";


        cableLayer.style.overflow =
            "visible";
    }


    installedCables = [];


    selectedCable = null;
    selectedBox = null;
    selectedDevice = null;
    selectedPowerCord = null;
    selectedKnockout = null;


    cableDragState = null;


    closeCableMenu();


    nextBoxNumber = 6;
    nextDeviceId = 1;
    nextCableId = 1;


    INITIAL_BOXES.forEach(
        (boxData) => {

            createJunctionBox(
                boxData.number,
                boxData.left,
                boxData.top
            );
        }
    );


    setMessage(
        "Lab reset. Drag junction boxes to move them."
    );
}


/* =========================================================
   8. DEVICE INSTALLATION
========================================================= */

function deviceName(
    deviceOrType
) {

    if (
        typeof deviceOrType ===
        "string"
    ) {

        return (
            DEVICE_NAMES[
                deviceOrType
            ] ||
            deviceOrType
        );
    }


    return (
        DEVICE_NAMES[
            deviceOrType.dataset.component
        ] ||
        "Device"
    );
}


function getInstalledDevice(box) {

    return box.querySelector(
        ":scope > .installed-device"
    );
}


function createInstalledDevice(type) {

    const device =
        document.createElement("div");


    device.className =
        "installed-device";


    device.dataset.component =
        type;


    device.dataset.deviceId =
        String(nextDeviceId++);


    device.innerHTML =
        deviceMarkup(type);


    return device;
}


/* =========================================================
   DEVICE MARKUP
========================================================= */

function deviceMarkup(type) {

    if (
        type ===
            "duplex-receptacle" ||
        type ===
            "half-hot-receptacle"
    ) {

        const extraClass =
            type ===
            "half-hot-receptacle"
                ? " half-hot-device"
                : "";


        return `
            <div class="device-body receptacle-device${extraClass}">

                <div class="slot top"></div>
                <div class="slot bottom"></div>

                <div class="brass-side"></div>
                <div class="silver-side"></div>

                <div class="device-terminal hot"
                     data-terminal="hot"
                     style="right:-7px;top:28px;">
                </div>

                <div class="device-terminal neutral"
                     data-terminal="neutral"
                     style="left:-7px;top:28px;">
                </div>

                <div class="device-terminal ground"
                     data-terminal="ground"
                     style="left:50%;bottom:-7px;transform:translateX(-50%);">
                </div>

            </div>
        `;
    }


    if (type === "gfci") {

        return `
            <div class="device-body gfci-device">

                <div class="slot top"></div>
                <div class="slot bottom"></div>

                <div class="button-reset">
                    RESET
                </div>

                <div class="button-test">
                    TEST
                </div>

                <div class="device-terminal hot"
                     data-terminal="line-hot"
                     style="right:-7px;top:14px;">
                </div>

                <div class="device-terminal hot"
                     data-terminal="load-hot"
                     style="right:-7px;top:48px;">
                </div>

                <div class="device-terminal neutral"
                     data-terminal="line-neutral"
                     style="left:-7px;top:14px;">
                </div>

                <div class="device-terminal neutral"
                     data-terminal="load-neutral"
                     style="left:-7px;top:48px;">
                </div>

                <div class="device-terminal ground"
                     data-terminal="ground"
                     style="left:50%;bottom:-7px;transform:translateX(-50%);">
                </div>

            </div>
        `;
    }


    if (type === "single-pole-switch") {

        return `
            <div class="device-body switch-device">

                <div class="toggle"></div>

                <div class="device-terminal hot"
                     data-terminal="hot"
                     style="right:-7px;top:18px;">
                </div>

                <div class="device-terminal red"
                     data-terminal="switched-hot"
                     style="right:-7px;top:46px;">
                </div>

                <div class="device-terminal ground"
                     data-terminal="ground"
                     style="left:50%;bottom:-7px;transform:translateX(-50%);">
                </div>

            </div>
        `;
    }


    if (type === "light-fixture") {

        return `
            <div class="device-body light-fixture-device">

                <div class="fixture-body"></div>
                <div class="fixture-base"></div>

                <div class="device-terminal hot"
                     data-terminal="hot"
                     style="right:2px;top:18px;">
                </div>

                <div class="device-terminal neutral"
                     data-terminal="neutral"
                     style="left:2px;top:18px;">
                </div>

                <div class="device-terminal ground"
                     data-terminal="ground"
                     style="left:50%;bottom:-4px;transform:translateX(-50%);">
                </div>

            </div>
        `;
    }


    if (type === "light-bulb") {

        return `
            <div class="device-body light-bulb-device">

                <div class="bulb-glass"></div>
                <div class="bulb-base"></div>

            </div>
        `;
    }


    return "";
}


/* =========================================================
   INSTALL DEVICE IN BOX
========================================================= */

function installDeviceInBox(
    type,
    box
) {

    if (getInstalledDevice(box)) {

        setMessage(
            `${boxLabel(box)} already has a device. Remove it first.`
        );

        return;
    }


    const wrapper =
        createInstalledDevice(type);


    const inner =
        wrapper.querySelector(
            ".device-body"
        );


    if (inner) {

        inner.classList.remove(
            "device-body"
        );


        wrapper.className =
            `installed-device ${inner.className}`;


        wrapper.append(
            ...inner.childNodes
        );


        inner.remove();
    }


    box.appendChild(
        wrapper
    );


    selectDevice(
        wrapper
    );


    setMessage(
        `${deviceName(type)} snapped into ${boxLabel(box)}.`
    );
}


/* =========================================================
   INSTALL LIGHT BULB
========================================================= */

function installBulbAtPoint(
    x,
    y
) {

    const fixture =
        getFixtureAtPoint(
            x,
            y
        );


    if (!fixture) {

        setMessage(
            "Install the bulb into a light fixture."
        );

        return;
    }


    if (
        fixture.querySelector(
            ".light-bulb-device"
        )
    ) {

        setMessage(
            "That fixture already has a bulb."
        );

        return;
    }


    const bulb =
        document.createElement("div");


    bulb.className =
        "installed-device light-bulb-device";


    bulb.dataset.component =
        "light-bulb";


    bulb.dataset.deviceId =
        String(nextDeviceId++);


    bulb.innerHTML = `
        <div class="bulb-glass"></div>
        <div class="bulb-base"></div>
    `;


    fixture.appendChild(
        bulb
    );


    selectDevice(
        bulb
    );


    setMessage(
        `Light Bulb installed in ${boxLabel(
            fixture.closest(".junction-box")
        )}.`
    );
}


/* =========================================================
   REMOVE SELECTED DEVICE
========================================================= */

function removeSelectedDevice() {

    if (!selectedDevice) {
        return false;
    }


    const name =
        deviceName(
            selectedDevice
        );


    const box =
        selectedDevice.closest(
            ".junction-box"
        );


    selectedDevice.remove();


    selectedDevice = null;


    if (box) {
        selectBox(box);
    }


    setMessage(
        `${name} removed.`
    );


    return true;
}


/* =========================================================
   9. CABLE MANAGEMENT
========================================================= */

function getCableLayer() {

    const cableLayer =
        document.getElementById(
            "cableLayer"
        );


    if (cableLayer) {

        cableLayer.style.pointerEvents =
            "none";


        cableLayer.style.overflow =
            "visible";
    }


    return cableLayer;
}


/* =========================================================
   CREATE CABLE
========================================================= */

function createCableLine(type) {

    const cableLayer =
        getCableLayer();


    if (!cableLayer) {

        setMessage(
            "Cable layer could not be found."
        );

        return null;
    }


    const normalizedType =
        normalizeCableType(type);


    const cableElement =
        document.createElement("div");


    cableElement.className =
        `cable ${
            is14_3Cable(normalizedType)
                ? "three-wire"
                : "two-wire"
        }`;


    cableElement.dataset.cableType =
        normalizedType;


    Object.assign(
        cableElement.style,
        {
            position: "absolute",
            left: "0px",
            top: "0px",
            width: "0px",
            height: "28px",
            transformOrigin: "left center",
            pointerEvents: "auto",
            touchAction: "none",
            cursor: "pointer",
            zIndex: "1"
        }
    );


    const visual =
        document.createElement("div");


    visual.className =
        "cable-visual";


    Object.assign(
        visual.style,
        {
            position: "absolute",
            left: "0px",
            top: "10px",
            width: "100%",
            height: "8px",
            borderRadius: "999px",
            pointerEvents: "none",
            background:
                is14_3Cable(normalizedType)
                    ? "#333"
                    : "#4a4a4a"
        }
    );


    const hitArea =
        document.createElement("div");


    hitArea.className =
        "cable-hit-area";


    Object.assign(
        hitArea.style,
        {
            position: "absolute",
            left: "0px",
            top: "0px",
            width: "100%",
            height: "28px",
            background:
                "rgba(0,0,0,0.001)",
            pointerEvents: "auto",
            cursor: "pointer",
            touchAction: "none"
        }
    );


    cableElement.append(
        visual,
        hitArea
    );


    cableLayer.appendChild(
        cableElement
    );


    /* -----------------------------------------------------
       SELECT CABLE
    ----------------------------------------------------- */

    hitArea.addEventListener(
        "pointerdown",
        (event) => {

            if (cableDragState) {
                return;
            }


            const cable =
                installedCables.find(
                    (item) =>
                        item.element ===
                        cableElement
                );


            if (!cable) {
                return;
            }


            event.preventDefault();
            event.stopPropagation();


            selectCable(cable);
        }
    );


    /* -----------------------------------------------------
       DOUBLE CLICK TO REMOVE
    ----------------------------------------------------- */

    hitArea.addEventListener(
        "dblclick",
        (event) => {

            if (cableDragState) {
                return;
            }


            event.preventDefault();
            event.stopPropagation();


            const cable =
                installedCables.find(
                    (item) =>
                        item.element ===
                        cableElement
                );


            if (!cable) {
                return;
            }


            removeInstalledCable(
                cable
            );


            setMessage(
                "Cable removed."
            );
        }
    );


    return {
        element: cableElement,
        visual,
        hitArea
    };
}


/* =========================================================
   UPDATE CABLE POSITION
========================================================= */

function updateCableLine(
    cable,
    x1,
    y1,
    x2,
    y2
) {

    if (!cable?.element) {
        return;
    }


    const dx =
        x2 - x1;


    const dy =
        y2 - y1;


    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const angle =
        Math.atan2(
            dy,
            dx
        ) *
        180 /
        Math.PI;


    const element =
        cable.element;


    element.style.left =
        `${x1}px`;


    element.style.top =
        `${y1 - 14}px`;


    element.style.width =
        `${Math.max(length, 1)}px`;


    element.style.height =
        "28px";


    element.style.transform =
        `rotate(${angle}deg)`;
}


/* =========================================================
   UPDATE INSTALLED CABLE
========================================================= */

function updateInstalledCablePosition(
    cable
) {

    if (
        !cable?.startKnockout ||
        !cable?.endKnockout
    ) {
        return;
    }


    const start =
        getKnockoutCenter(
            cable.startKnockout
        );


    const end =
        getKnockoutCenter(
            cable.endKnockout
        );


    updateCableLine(
        cable,
        start.x,
        start.y,
        end.x,
        end.y
    );
}


/* =========================================================
   UPDATE ALL CABLES
========================================================= */

function updateAllCablePositions() {

    installedCables.forEach(
        updateInstalledCablePosition
    );


    if (
        cableDragState?.cable
    ) {

        updatePendingCable(
            cableDragState.cable,
            cableDragState.pointerX,
            cableDragState.pointerY
        );
    }
}


/* =========================================================
   GET KNOCKOUT CENTER
========================================================= */

function getKnockoutCenter(
    knockout
) {

    const boardRect =
        workboard.getBoundingClientRect();


    const rect =
        knockout.getBoundingClientRect();


    return {

        x:
            rect.left +
            rect.width / 2 -
            boardRect.left,

        y:
            rect.top +
            rect.height / 2 -
            boardRect.top
    };
}


/* =========================================================
   GET POINTER POSITION
========================================================= */

function getPointerPosition(
    event
) {

    const boardRect =
        workboard.getBoundingClientRect();


    return {

        x:
            event.clientX -
            boardRect.left,

        y:
            event.clientY -
            boardRect.top
    };
}


/* =========================================================
   UPDATE PENDING CABLE
========================================================= */

function updatePendingCable(
    cable,
    pointerX,
    pointerY
) {

    if (!cable?.startKnockout) {
        return;
    }


    const start =
        getKnockoutCenter(
            cable.startKnockout
        );


    updateCableLine(
        cable,
        start.x,
        start.y,
        pointerX,
        pointerY
    );
}


/* =========================================================
   START CABLE CONNECTION
========================================================= */

function startCableConnection(
    type,
    startKnockout
) {

    const normalizedType =
        normalizeCableType(type);


    if (!startKnockout) {

        setMessage(
            "Select a knockout opening."
        );

        return;
    }


    closeCableMenu();


    if (cableDragState) {
        cancelCableConnection();
    }


    const cableElements =
        createCableLine(
            normalizedType
        );


    if (!cableElements) {
        return;
    }


    const start =
        getKnockoutCenter(
            startKnockout
        );


    const cable = {

        id:
            nextCableId++,

        type:
            normalizedType,

        element:
            cableElements.element,

        visual:
            cableElements.visual,

        hitArea:
            cableElements.hitArea,

        startKnockout:
            startKnockout,

        endKnockout:
            null
    };


    cable.element.classList.add(
        "pending"
    );


    cable.visual.classList.add(
        "pending"
    );


    cable.hitArea.classList.add(
        "pending"
    );


    cable.element.style.pointerEvents =
        "none";


    cable.hitArea.style.pointerEvents =
        "none";


    updateCableLine(
        cable,
        start.x,
        start.y,
        start.x,
        start.y
    );


    cableDragState = {

        cable,

        pointerId: null,

        pointerX:
            start.x,

        pointerY:
            start.y
    };


    selectedCable = cable;


    startKnockout.classList.add(
        "connected"
    );


    setMessage(
        `${cableDisplayName(normalizedType)} selected. Connect it to another knockout.`
    );
}


/* =========================================================
   CABLE POINTER MOVE
========================================================= */

function onCablePointerMove(
    event
) {

    if (!cableDragState) {
        return;
    }


    if (
        cableDragState.pointerId !== null &&
        event.pointerId !==
        cableDragState.pointerId
    ) {
        return;
    }


    const position =
        getPointerPosition(
            event
        );


    cableDragState.pointerX =
        position.x;


    cableDragState.pointerY =
        position.y;


    updatePendingCable(
        cableDragState.cable,
        position.x,
        position.y
    );


    clearCableDropTargets();


    const knockout =
        getKnockoutAtPoint(
            event.clientX,
            event.clientY
        );


    if (
        !knockout ||
        knockout ===
        cableDragState.cable.startKnockout
    ) {
        return;
    }


    const startBox =
        cableDragState
            .cable
            .startKnockout
            ?.closest(
                ".junction-box"
            );


    const targetBox =
        knockout.closest(
            ".junction-box"
        );


    if (
        startBox &&
        targetBox &&
        startBox !== targetBox
    ) {

        knockout.classList.add(
            "drop-target"
        );
    }
}


/* =========================================================
   CABLE POINTER UP
========================================================= */

function onCablePointerUp(
    event
) {

    if (!cableDragState) {
        return;
    }


    if (
        cableDragState.pointerId !== null &&
        event.pointerId !==
        cableDragState.pointerId
    ) {
        return;
    }


    const knockout =
        getKnockoutAtPoint(
            event.clientX,
            event.clientY
        );


    clearCableDropTargets();


    finishCableConnection(
        knockout
    );
}


/* =========================================================
   FINISH CABLE CONNECTION
========================================================= */

function finishCableConnection(
    targetKnockout
) {

    if (!cableDragState) {
        return;
    }


    const cable =
        cableDragState.cable;


    const startKnockout =
        cable.startKnockout;


    if (!targetKnockout) {

        cancelCableConnection();


        setMessage(
            "Connect the cable to a knockout on another junction box."
        );

        return;
    }


    if (
        targetKnockout ===
        startKnockout
    ) {

        cancelCableConnection();


        setMessage(
            "Connect the cable to a knockout on another junction box."
        );

        return;
    }


    const startBox =
        startKnockout.closest(
            ".junction-box"
        );


    const endBox =
        targetKnockout.closest(
            ".junction-box"
        );


    if (
        !startBox ||
        !endBox ||
        startBox === endBox
    ) {

        cancelCableConnection();


        setMessage(
            "Connect the cable to a knockout on another junction box."
        );

        return;
    }


    cable.endKnockout =
        targetKnockout;


    cable.element.classList.remove(
        "pending"
    );


    cable.visual.classList.remove(
        "pending"
    );


    cable.hitArea.classList.remove(
        "pending"
    );


    targetKnockout.classList.add(
        "connected"
    );


    installedCables.push(
        cable
    );


    updateInstalledCablePosition(
        cable
    );


    cable.element.style.pointerEvents =
        "auto";


    cable.hitArea.style.pointerEvents =
        "auto";


    cableDragState = null;


    selectCable(
        cable
    );


    clearCableDropTargets();


    setMessage(
        `${cableDisplayName(cable.type)} connected from ${boxLabel(startBox)} to ${boxLabel(endBox)}.`
    );
}


/* =========================================================
   CANCEL CABLE CONNECTION
========================================================= */

function cancelCableConnection() {

    if (!cableDragState) {
        return;
    }


    const cable =
        cableDragState.cable;


    cable?.element?.remove();


    cable?.startKnockout?.classList.remove(
        "connected"
    );


    cableDragState = null;
    selectedCable = null;


    clearCableDropTargets();
}


/* =========================================================
   CLEAR CABLE DROP TARGETS
========================================================= */

function clearCableDropTargets() {

    document
        .querySelectorAll(
            ".knockout.drop-target"
        )
        .forEach((element) => {

            element.classList.remove(
                "drop-target"
            );
        });
}


/* =========================================================
   REMOVE INSTALLED CABLE
========================================================= */

function removeInstalledCable(
    cable
) {

    if (!cable) {
        return;
    }


    cable.startKnockout
        ?.classList.remove(
            "connected"
        );


    cable.endKnockout
        ?.classList.remove(
            "connected"
        );


    cable.element?.remove();


    installedCables =
        installedCables.filter(
            (item) =>
                item !== cable
        );


    if (
        selectedCable === cable
    ) {

        selectedCable = null;
    }
}


/* =========================================================
   REMOVE CABLES CONNECTED TO BOX
========================================================= */

function removeCablesConnectedToBox(
    box
) {

    installedCables
        .filter((cable) => {

            const startBox =
                cable.startKnockout
                    ?.closest(
                        ".junction-box"
                    );


            const endBox =
                cable.endKnockout
                    ?.closest(
                        ".junction-box"
                    );


            return (
                startBox === box ||
                endBox === box
            );
        })
        .forEach(
            removeInstalledCable
        );
}


/* =========================================================
   CABLE SELECTION
========================================================= */

function selectCable(
    cable
) {

    if (!cable) {

        clearCableSelection();

        return;
    }


    clearDeviceSelection();
    clearPowerCordSelection();


    document
        .querySelectorAll(
            ".junction-box.selected"
        )
        .forEach((element) => {

            element.classList.remove(
                "selected"
            );
        });


    selectedBox = null;


    document
        .querySelectorAll(
            ".cable.selected"
        )
        .forEach((element) => {

            element.classList.remove(
                "selected"
            );
        });


    selectedCable = cable;


    cable.element?.classList.add(
        "selected"
    );


    if (cable.hitArea) {

        cable.hitArea.style.pointerEvents =
            "auto";


        cable.hitArea.style.cursor =
            "pointer";
    }


    setMessage(
        `${cableDisplayName(cable.type)} selected.`
    );
}


/* =========================================================
   CLEAR CABLE SELECTION
========================================================= */

function clearCableSelection() {

    document
        .querySelectorAll(
            ".cable.selected"
        )
        .forEach((element) => {

            element.classList.remove(
                "selected"
            );
        });


    selectedCable = null;
}


/* =========================================================
   10. THREE-PRONG APPLIANCE POWER CORD
========================================================= */

function createPowerCord() {

    const cord =
        document.createElement("div");


    cord.className =
        "appliance-power-cord-installed";


    cord.dataset.component =
        "appliance-power-cord";


    cord.innerHTML = `
        <div class="component-icon appliance-cord-icon">

            <div class="plug-head">

                <span class="plug-prong prong-top"></span>
                <span class="plug-prong prong-bottom"></span>
                <span class="plug-ground"></span>

            </div>

            <div class="plug-cable"></div>

            <div class="pigtail">

                <span class="pigtail-wire black"></span>
                <span class="pigtail-wire white"></span>
                <span class="pigtail-wire green"></span>

            </div>

        </div>
    `;


    cord.addEventListener(
        "pointerdown",
        (event) => {

            if (event.button !== 0) {
                return;
            }


            selectPowerCord(
                cord
            );


            event.stopPropagation();
        }
    );


    return cord;
}


/* =========================================================
   CONNECT POWER CORD
========================================================= */

function connectPowerCordToKnockout(
    knockout
) {

    if (!knockout) {

        setMessage(
            "Select a knockout opening."
        );

        return;
    }


    let cord =
        powerCordLayer?.querySelector(
            ".appliance-power-cord-installed"
        );


    if (!cord) {

        cord =
            createPowerCord();


        if (!powerCordLayer) {

            setMessage(
                "Power cord layer is unavailable."
            );

            return;
        }


        powerCordLayer.appendChild(
            cord
        );
    }


    if (cord._connectedKnockout) {

        cord._connectedKnockout.classList.remove(
            "connected"
        );
    }


    cord._connectedKnockout =
        knockout;


    knockout.classList.add(
        "connected"
    );


    positionPowerCord(
        cord,
        knockout
    );


    selectPowerCord(
        cord
    );


    const box =
        knockout.closest(
            ".junction-box"
        );


    const boxName =
        box
            ? boxLabel(box)
            : "junction box";


    const position =
        knockout.dataset.position ||
        "opening";


    setMessage(
        `3-prong appliance power cord connected to the ${position} knockout on ${boxName}.`
    );
}


/* =========================================================
   POSITION POWER CORD
========================================================= */

function positionPowerCord(
    cord,
    knockout
) {

    if (!workboard) {
        return;
    }


    const boardRect =
        workboard.getBoundingClientRect();


    const knockoutRect =
        knockout.getBoundingClientRect();


    const x =
        knockoutRect.left +
        knockoutRect.width / 2 -
        boardRect.left;


    const y =
        knockoutRect.top +
        knockoutRect.height / 2 -
        boardRect.top;


    Object.assign(
        cord.style,
        {
            position: "absolute",
            left: `${x}px`,
            top: `${y}px`,
            transform:
                "translate(-50%, -50%)",
            zIndex: "20"
        }
    );
}


/* =========================================================
   REMOVE POWER CORD
========================================================= */

function removePowerCord(
    cord
) {

    if (!cord) {
        return false;
    }


    cord._connectedKnockout
        ?.classList.remove(
            "connected"
        );


    cord.remove();


    selectedPowerCord = null;


    setMessage(
        "3-prong appliance power cord disconnected."
    );


    return true;
}


/* =========================================================
   DISCONNECT SELECTED POWER CORD
========================================================= */

function disconnectSelectedPowerCord() {

    if (!selectedPowerCord) {
        return false;
    }


    return removePowerCord(
        selectedPowerCord
    );
}


/* =========================================================
   11. CABLE SELECTION MENU
========================================================= */

function showCableMenu(
    knockout
) {

    if (cableDragState) {
        return;
    }


    closeCableMenu();


    selectedKnockout =
        knockout;


    const menu =
        document.createElement("div");


    menu.className =
        "cable-menu";


    menu.innerHTML = `
        <button
            type="button"
            data-cable-type="14-2-nmb">
            14/2 Wire
        </button>

        <button
            type="button"
            data-cable-type="14-3-nmb">
            14/3 Wire
        </button>
    `;


    /*
    ---------------------------------------------------------
    IMPORTANT:
    Stop pointer events inside the menu from reaching the
    document-level outside-click handler.
    ---------------------------------------------------------
    */

    menu.addEventListener(
        "pointerdown",
        (event) => {

            event.stopPropagation();
        }
    );


    menu.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();
        }
    );


    document.body.appendChild(
        menu
    );


    cableMenu =
        menu;


    const rect =
        knockout.getBoundingClientRect();


    menu.style.left =
        `${rect.right + 8}px`;


    menu.style.top =
        `${rect.top}px`;


    /*
    ---------------------------------------------------------
    WIRE TYPE BUTTONS
    ---------------------------------------------------------
    */

    menu
        .querySelectorAll(
            "[data-cable-type]"
        )
        .forEach((button) => {

            button.addEventListener(
                "pointerdown",
                (event) => {

                    if (
                        event.button !== 0
                    ) {
                        return;
                    }


                    event.preventDefault();
                    event.stopPropagation();


                    const cableType =
                        normalizeCableType(
                            button.dataset.cableType
                        );


                    const startKnockout =
                        selectedKnockout;


                    /*
                    Close the menu first, then begin
                    the cable connection.
                    */

                    closeCableMenu();


                    if (
                        startKnockout
                    ) {

                        startCableConnection(
                            cableType,
                            startKnockout
                        );
                    }
                }
            );
        });
}


/* =========================================================
   CLOSE CABLE MENU
========================================================= */

function closeCableMenu() {

    if (cableMenu) {

        cableMenu.remove();

        cableMenu = null;
    }


    selectedKnockout = null;
}


/* =========================================================
   12. LAB CONTROLS
========================================================= */

function bindLabControls() {

    /* -----------------------------------------------------
       ADD JUNCTION BOX
    ----------------------------------------------------- */

    addBoxButton?.addEventListener(
        "click",
        addJunctionBox
    );


    /* -----------------------------------------------------
       REMOVE / DISCONNECT
    ----------------------------------------------------- */

    removeBoxButton?.addEventListener(
        "click",
        () => {

            if (selectedPowerCord) {

                disconnectSelectedPowerCord();

                return;
            }


            if (selectedDevice) {

                removeSelectedDevice();

                return;
            }


            if (selectedCable) {

                removeInstalledCable(
                    selectedCable
                );


                setMessage(
                    "Cable removed."
                );


                return;
            }


            removeSelectedBox();
        }
    );


    /* -----------------------------------------------------
       RESET LAB
    ----------------------------------------------------- */

    resetLabButton?.addEventListener(
        "click",
        resetJunctionBoxes
    );


    /* -----------------------------------------------------
       POINTER EVENTS
    ----------------------------------------------------- */

    document.addEventListener(
        "pointermove",
        onPointerMove
    );


    document.addEventListener(
        "pointerup",
        onPointerUp
    );


    document.addEventListener(
        "pointercancel",
        (event) => {

            if (cableDragState) {

                cancelCableConnection();

                return;
            }


            onPointerUp(
                event
            );
        }
    );


    /* -----------------------------------------------------
       DELETE / BACKSPACE
    ----------------------------------------------------- */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !== "Delete" &&
                event.key !== "Backspace"
            ) {
                return;
            }


            if (
                event.target.matches(
                    "input, textarea"
                )
            ) {
                return;
            }


            if (selectedPowerCord) {

                if (
                    disconnectSelectedPowerCord()
                ) {

                    event.preventDefault();
                }


                return;
            }


            if (selectedDevice) {

                if (
                    removeSelectedDevice()
                ) {

                    event.preventDefault();
                }


                return;
            }


            if (selectedCable) {

                removeInstalledCable(
                    selectedCable
                );


                setMessage(
                    "Cable removed."
                );


                event.preventDefault();

                return;
            }


            if (selectedBox) {

                removeSelectedBox();

                event.preventDefault();
            }
        }
    );


    /* -----------------------------------------------------
       CLOSE CABLE MENU OUTSIDE
    ----------------------------------------------------- */

    document.addEventListener(
        "pointerdown",
        (event) => {

            if (!cableMenu) {
                return;
            }


            /*
            Clicking a cable menu button is handled
            by the menu itself and stopped above.
            */

            if (
                event.target.closest(
                    ".cable-menu"
                )
            ) {
                return;
            }


            /*
            Clicking a knockout should replace the
            current menu rather than simply closing it.
            */

            if (
                event.target.closest(
                    ".knockout"
                )
            ) {
                return;
            }


            closeCableMenu();
        }
    );


    /* -----------------------------------------------------
       CLEAR WORKBOARD SELECTION
    ----------------------------------------------------- */

    workboard?.addEventListener(
        "pointerdown",
        (event) => {

            if (
                event.target.closest?.(
                    ".cable"
                ) ||
                event.target.closest?.(
                    ".cable-hit-area"
                )
            ) {
                return;
            }


            if (
                !event.target.closest(
                    ".junction-box"
                ) &&
                !event.target.closest(
                    ".appliance-power-cord-installed"
                )
            ) {

                clearDeviceSelection();
                clearPowerCordSelection();
                clearCableSelection();

                selectBox(null);
            }
        }
    );
}


/* =========================================================
   13. INITIALIZATION
========================================================= */

function init() {

    document
        .querySelectorAll(
            ".junction-box"
        )
        .forEach(
            attachBoxEvents
        );


    const cableLayer =
        document.getElementById(
            "cableLayer"
        );


    if (cableLayer) {

        cableLayer.style.pointerEvents =
            "none";


        cableLayer.style.overflow =
            "visible";
    }


    bindToolboxDrag();

    bindLabControls();


    setMessage(
        "Drag a wiring device onto a junction box to snap it in place."
    );
}


init();