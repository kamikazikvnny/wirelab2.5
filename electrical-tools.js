/* =========================================================
   WIRELAB
   ELECTRICAL VALUES
   Interactive Learning Widgets
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       HELPER FUNCTIONS
    ===================================================== */

    function createElement(tag, className, text = "") {

        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== "") {
            element.textContent = text;
        }

        return element;
    }


    function createSlider(
        label,
        min,
        max,
        step,
        value,
        unit = ""
    ) {

        const wrapper = createElement(
            "div",
            "value-control"
        );

        const labelRow = createElement(
            "div",
            "value-control-label"
        );

        const labelText = createElement(
            "span",
            "",
            label
        );

        const valueDisplay = createElement(
            "span",
            "value-control-number"
        );

        valueDisplay.textContent =
            `${value}${unit}`;

        labelRow.appendChild(labelText);
        labelRow.appendChild(valueDisplay);


        const slider = document.createElement("input");

        slider.type = "range";
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = value;

        /*
         * Explicit class for the slider.
         */
        slider.className = "value-slider";

        slider.setAttribute(
            "aria-label",
            label
        );


        slider.addEventListener(
            "input",
            () => {

                valueDisplay.textContent =
                    `${slider.value}${unit}`;

            }
        );


        wrapper.appendChild(labelRow);
        wrapper.appendChild(slider);


        return {
            wrapper,
            slider
        };

    }


    function createResult(
        label,
        value,
        unit = ""
    ) {

        const result = createElement(
            "div",
            "value-result"
        );

        const resultLabel = createElement(
            "span",
            "value-result-label",
            label
        );

        const resultNumber = createElement(
            "strong",
            "value-result-number"
        );

        resultNumber.textContent =
            `${value}${unit}`;

        result.appendChild(resultLabel);
        result.appendChild(resultNumber);

        return {
            result,
            number: resultNumber
        };

    }


    function getInteractiveArea(card) {

        let area =
            card.querySelector(".interactive-value");

        if (!area) {

            area = createElement(
                "div",
                "interactive-value"
            );

            card.appendChild(area);

        }

        area.innerHTML = "";

        return area;

    }


    function formatNumber(
        number,
        decimals = 2
    ) {

        return Number(number)
            .toFixed(decimals);

    }


    /* =====================================================
       01 — OHM'S LAW
    ===================================================== */

    function buildOhmsLaw(card) {

        const area =
            getInteractiveArea(card);

        const controls =
            createElement(
                "div",
                "value-controls"
            );

        const voltage =
            createSlider(
                "Voltage",
                1,
                240,
                1,
                120,
                " V"
            );

        const resistance =
            createSlider(
                "Resistance",
                1,
                120,
                1,
                60,
                " Ω"
            );

        controls.appendChild(
            voltage.wrapper
        );

        controls.appendChild(
            resistance.wrapper
        );


        const results =
            createElement(
                "div",
                "value-results"
            );

        const current =
            createResult(
                "Current",
                "0.00",
                " A"
            );

        results.appendChild(
            current.result
        );


        const equation =
            createElement(
                "div",
                "interactive-equation"
            );


        area.appendChild(controls);
        area.appendChild(results);
        area.appendChild(equation);


        function update() {

            const V =
                Number(
                    voltage.slider.value
                );

            const R =
                Number(
                    resistance.slider.value
                );

            const I =
                V / R;


            current.number.textContent =
                `${formatNumber(I)} A`;


            equation.textContent =
                `I = V ÷ R = ${V} ÷ ${R} = ${formatNumber(I)} A`;

        }


        voltage.slider.addEventListener(
            "input",
            update
        );

        resistance.slider.addEventListener(
            "input",
            update
        );

        update();

    }


    /* =====================================================
       02 — ATOMIC STRUCTURE
    ===================================================== */

    function buildAtomicStructure(card) {

        const area =
            getInteractiveArea(card);

        const controls =
            createElement(
                "div",
                "value-controls"
            );


        const protons =
            createSlider(
                "Protons",
                1,
                10,
                1,
                3
            );

        const neutrons =
            createSlider(
                "Neutrons",
                0,
                12,
                1,
                4
            );

        const electrons =
            createSlider(
                "Electrons",
                0,
                12,
                1,
                3
            );


        controls.appendChild(
            protons.wrapper
        );

        controls.appendChild(
            neutrons.wrapper
        );

        controls.appendChild(
            electrons.wrapper
        );


        const visualization =
            createElement(
                "div",
                "interactive-atom"
            );

        const nucleus =
            createElement(
                "div",
                "interactive-nucleus"
            );


        const atomValues =
            createElement(
                "div",
                "atom-particle-values"
            );


        visualization.appendChild(
            nucleus
        );


        const results =
            createElement(
                "div",
                "value-results"
            );


        const massNumber =
            createResult(
                "Mass Number",
                "0"
            );

        const charge =
            createResult(
                "Net Charge",
                "0"
            );


        results.appendChild(
            massNumber.result
        );

        results.appendChild(
            charge.result
        );


        area.appendChild(controls);
        area.appendChild(visualization);
        area.appendChild(atomValues);
        area.appendChild(results);


        function update() {

            const p =
                Number(
                    protons.slider.value
                );

            const n =
                Number(
                    neutrons.slider.value
                );

            const e =
                Number(
                    electrons.slider.value
                );


            nucleus.innerHTML = "";


            for (
                let i = 0;
                i < p;
                i++
            ) {

                const proton =
                    createElement(
                        "span",
                        "proton",
                        "+"
                    );

                nucleus.appendChild(
                    proton
                );

            }


            for (
                let i = 0;
                i < n;
                i++
            ) {

                const neutron =
                    createElement(
                        "span",
                        "neutron",
                        "0"
                    );

                nucleus.appendChild(
                    neutron
                );

            }


            atomValues.textContent =
                `Protons: ${p} | Neutrons: ${n} | Electrons: ${e}`;


            massNumber.number.textContent =
                `${p + n}`;


            const netCharge =
                p - e;


            charge.number.textContent =
                netCharge > 0
                    ? `+${netCharge}`
                    : `${netCharge}`;

        }


        protons.slider.addEventListener(
            "input",
            update
        );

        neutrons.slider.addEventListener(
            "input",
            update
        );

        electrons.slider.addEventListener(
            "input",
            update
        );


        update();

    }


    /* =====================================================
       03 — ELECTRICAL POWER
    ===================================================== */

    function buildPower(card) {

        const area =
            getInteractiveArea(card);

        const controls =
            createElement(
                "div",
                "value-controls"
            );


        const voltage =
            createSlider(
                "Voltage",
                1,
                240,
                1,
                120,
                " V"
            );


        const current =
            createSlider(
                "Current",
                0.1,
                30,
                0.1,
                5,
                " A"
            );


        controls.appendChild(
            voltage.wrapper
        );

        controls.appendChild(
            current.wrapper
        );


        const results =
            createElement(
                "div",
                "value-results"
            );


        const power =
            createResult(
                "Power",
                "0.00",
                " W"
            );


        results.appendChild(
            power.result
        );


        const equation =
            createElement(
                "div",
                "interactive-equation"
            );


        area.appendChild(controls);
        area.appendChild(results);
        area.appendChild(equation);


        function update() {

            const V =
                Number(
                    voltage.slider.value
                );

            const I =
                Number(
                    current.slider.value
                );


            const P =
                V * I;


            power.number.textContent =
                `${formatNumber(P)} W`;


            equation.textContent =
                `P = V × I = ${V} × ${I} = ${formatNumber(P)} W`;

        }


        voltage.slider.addEventListener(
            "input",
            update
        );

        current.slider.addEventListener(
            "input",
            update
        );


        update();

    }


    /* =====================================================
       04 — SERIES CIRCUIT
    ===================================================== */

    function buildSeries(card) {

        const area =
            getInteractiveArea(card);

        const controls =
            createElement(
                "div",
                "value-controls"
            );


        const resistor1 =
            createSlider(
                "Resistor 1",
                1,
                100,
                1,
                20,
                " Ω"
            );


        const resistor2 =
            createSlider(
                "Resistor 2",
                1,
                100,
                1,
                40,
                " Ω"
            );


        const voltage =
            createSlider(
                "Source Voltage",
                1,
                240,
                1,
                120,
                " V"
            );


        controls.appendChild(
            resistor1.wrapper
        );

        controls.appendChild(
            resistor2.wrapper
        );

        controls.appendChild(
            voltage.wrapper
        );


        const results =
            createElement(
                "div",
                "value-results"
            );


        const totalResistance =
            createResult(
                "Total Resistance",
                "0.00",
                " Ω"
            );


        const current =
            createResult(
                "Circuit Current",
                "0.00",
                " A"
            );


        results.appendChild(
            totalResistance.result
        );

        results.appendChild(
            current.result
        );


        area.appendChild(controls);
        area.appendChild(results);


        function update() {

            const R1 =
                Number(
                    resistor1.slider.value
                );

            const R2 =
                Number(
                    resistor2.slider.value
                );

            const V =
                Number(
                    voltage.slider.value
                );


            const RT =
                R1 + R2;


            const I =
                V / RT;


            totalResistance.number.textContent =
                `${formatNumber(RT)} Ω`;


            current.number.textContent =
                `${formatNumber(I)} A`;

        }


        resistor1.slider.addEventListener(
            "input",
            update
        );

        resistor2.slider.addEventListener(
            "input",
            update
        );

        voltage.slider.addEventListener(
            "input",
            update
        );


        update();

    }


    /* =====================================================
       05 — PARALLEL CIRCUIT
    ===================================================== */

    function buildParallel(card) {

        const area =
            getInteractiveArea(card);

        const controls =
            createElement(
                "div",
                "value-controls"
            );


        const resistor1 =
            createSlider(
                "Branch 1 Resistance",
                1,
                100,
                1,
                20,
                " Ω"
            );


        const resistor2 =
            createSlider(
                "Branch 2 Resistance",
                1,
                100,
                1,
                40,
                " Ω"
            );


        const voltage =
            createSlider(
                "Source Voltage",
                1,
                240,
                1,
                120,
                " V"
            );


        controls.appendChild(
            resistor1.wrapper
        );

        controls.appendChild(
            resistor2.wrapper
        );

        controls.appendChild(
            voltage.wrapper
        );


        const results =
            createElement(
                "div",
                "value-results"
            );


        const totalResistance =
            createResult(
                "Total Resistance",
                "0.00",
                " Ω"
            );


        const totalCurrent =
            createResult(
                "Total Current",
                "0.00",
                " A"
            );


        results.appendChild(
            totalResistance.result
        );

        results.appendChild(
            totalCurrent.result
        );


        area.appendChild(controls);
        area.appendChild(results);


        function update() {

            const R1 =
                Number(
                    resistor1.slider.value
                );

            const R2 =
                Number(
                    resistor2.slider.value
                );

            const V =
                Number(
                    voltage.slider.value
                );


            const RT =
                (R1 * R2) /
                (R1 + R2);


            const I =
                V / RT;


            totalResistance.number.textContent =
                `${formatNumber(RT)} Ω`;


            totalCurrent.number.textContent =
                `${formatNumber(I)} A`;

        }


        resistor1.slider.addEventListener(
            "input",
            update
        );

        resistor2.slider.addEventListener(
            "input",
            update
        );

        voltage.slider.addEventListener(
            "input",
            update
        );


        update();

    }


    /* =====================================================
       06 — RESISTANCE
    ===================================================== */

    function buildResistance(card) {

        const area =
            getInteractiveArea(card);

        const controls =
            createElement(
                "div",
                "value-controls"
            );


        const resistivity =
            createSlider(
                "Resistivity",
                0.001,
                0.030,
                0.0001,
                0.0172
            );


        const length =
            createSlider(
                "Length",
                0.1,
                20,
                0.1,
                10,
                " m"
            );


        const areaSize =
            createSlider(
                "Cross-Sectional Area",
                0.1,
                20,
                0.1,
                2,
                " mm²"
            );


        controls.appendChild(
            resistivity.wrapper
        );

        controls.appendChild(
            length.wrapper
        );

        controls.appendChild(
            areaSize.wrapper
        );


        const results =
            createElement(
                "div",
                "value-results"
            );


        const resistance =
            createResult(
                "Resistance",
                "0.00",
                " Ω"
            );


        results.appendChild(
            resistance.result
        );


        const equation =
            createElement(
                "div",
                "interactive-equation"
            );


        area.appendChild(controls);
        area.appendChild(results);
        area.appendChild(equation);


        function update() {

            const rho =
                Number(
                    resistivity.slider.value
                );

            const L =
                Number(
                    length.slider.value
                );

            const A =
                Number(
                    areaSize.slider.value
                );


            const R =
                (rho * L) /
                A;


            resistance.number.textContent =
                `${formatNumber(R, 3)} Ω`;


            equation.textContent =
                `R = ρL ÷ A = ${formatNumber(R, 3)} Ω`;

        }


        resistivity.slider.addEventListener(
            "input",
            update
        );

        length.slider.addEventListener(
            "input",
            update
        );

        areaSize.slider.addEventListener(
            "input",
            update
        );


        update();

    }


    /* =====================================================
       07 — VOLTAGE DROP
    ===================================================== */

    function buildVoltageDrop(card) {

        const area =
            getInteractiveArea(card);

        const controls =
            createElement(
                "div",
                "value-controls"
            );


        const current =
            createSlider(
                "Current",
                0.1,
                50,
                0.1,
                15,
                " A"
            );


        const resistance =
            createSlider(
                "Circuit Resistance",
                0.01,
                5,
                0.01,
                0.25,
                " Ω"
            );


        controls.appendChild(
            current.wrapper
        );

        controls.appendChild(
            resistance.wrapper
        );


        const results =
            createElement(
                "div",
                "value-results"
            );


        const voltageDrop =
            createResult(
                "Voltage Drop",
                "0.00",
                " V"
            );


        results.appendChild(
            voltageDrop.result
        );


        const equation =
            createElement(
                "div",
                "interactive-equation"
            );


        area.appendChild(controls);
        area.appendChild(results);
        area.appendChild(equation);


        function update() {

            const I =
                Number(
                    current.slider.value
                );

            const R =
                Number(
                    resistance.slider.value
                );


            const Vdrop =
                I * R;


            voltageDrop.number.textContent =
                `${formatNumber(Vdrop)} V`;


            equation.textContent =
                `Vdrop = I × R = ${I} × ${R} = ${formatNumber(Vdrop)} V`;

        }


        current.slider.addEventListener(
            "input",
            update
        );

        resistance.slider.addEventListener(
            "input",
            update
        );


        update();

    }


    /* =====================================================
       08 — AC FREQUENCY
    ===================================================== */

    function buildFrequency(card) {

        const area =
            getInteractiveArea(card);

        const controls =
            createElement(
                "div",
                "value-controls"
            );


        const frequency =
            createSlider(
                "Frequency",
                1,
                120,
                1,
                60,
                " Hz"
            );


        controls.appendChild(
            frequency.wrapper
        );


        const results =
            createElement(
                "div",
                "value-results"
            );


        const period =
            createResult(
                "Period",
                "0.00",
                " ms"
            );


        results.appendChild(
            period.result
        );


        const waveform =
            createElement(
                "div",
                "ac-waveform"
            );


        const waveLine =
            createElement(
                "div",
                "wave-line"
            );


        waveform.appendChild(
            waveLine
        );


        area.appendChild(controls);
        area.appendChild(waveform);
        area.appendChild(results);


        function update() {

            const f =
                Number(
                    frequency.slider.value
                );


            const T =
                1 / f;


            const milliseconds =
                T * 1000;


            period.number.textContent =
                `${formatNumber(milliseconds)} ms`;


            waveLine.style.animationDuration =
                `${Math.max(T, 0.1)}s`;

        }


        frequency.slider.addEventListener(
            "input",
            update
        );


        update();

    }


    /* =====================================================
       09 — INDUCTANCE
    ===================================================== */

    function buildInductance(card) {

        const area =
            getInteractiveArea(card);

        const controls =
            createElement(
                "div",
                "value-controls"
            );


        const frequency =
            createSlider(
                "Frequency",
                1,
                120,
                1,
                60,
                " Hz"
            );


        const inductance =
            createSlider(
                "Inductance",
                1,
                500,
                1,
                100,
                " mH"
            );


        controls.appendChild(
            frequency.wrapper
        );

        controls.appendChild(
            inductance.wrapper
        );


        const results =
            createElement(
                "div",
                "value-results"
            );


        const reactance =
            createResult(
                "Inductive Reactance",
                "0.00",
                " Ω"
            );


        results.appendChild(
            reactance.result
        );


        const equation =
            createElement(
                "div",
                "interactive-equation"
            );


        area.appendChild(controls);
        area.appendChild(results);
        area.appendChild(equation);


        function update() {

            const f =
                Number(
                    frequency.slider.value
                );


            const LmH =
                Number(
                    inductance.slider.value
                );


            const L =
                LmH / 1000;


            const XL =
                2 *
                Math.PI *
                f *
                L;


            reactance.number.textContent =
                `${formatNumber(XL)} Ω`;


            equation.textContent =
                `XL = 2πfL = ${formatNumber(XL)} Ω`;

        }


        frequency.slider.addEventListener(
            "input",
            update
        );

        inductance.slider.addEventListener(
            "input",
            update
        );


        update();

    }


    /* =====================================================
       10 — CAPACITANCE
    ===================================================== */

    function buildCapacitance(card) {

        const area =
            getInteractiveArea(card);

        const controls =
            createElement(
                "div",
                "value-controls"
            );


        const capacitance =
            createSlider(
                "Capacitance",
                1,
                1000,
                1,
                100,
                " µF"
            );


        const voltage =
            createSlider(
                "Voltage",
                1,
                240,
                1,
                120,
                " V"
            );


        controls.appendChild(
            capacitance.wrapper
        );

        controls.appendChild(
            voltage.wrapper
        );


        const results =
            createElement(
                "div",
                "value-results"
            );


        const charge =
            createResult(
                "Stored Charge",
                "0.000",
                " C"
            );


        results.appendChild(
            charge.result
        );


        const equation =
            createElement(
                "div",
                "interactive-equation"
            );


        area.appendChild(controls);
        area.appendChild(results);
        area.appendChild(equation);


        function update() {

            const CuF =
                Number(
                    capacitance.slider.value
                );


            const V =
                Number(
                    voltage.slider.value
                );


            const C =
                CuF / 1000000;


            const Q =
                C * V;


            charge.number.textContent =
                `${formatNumber(Q, 4)} C`;


            equation.textContent =
                `Q = CV = ${formatNumber(Q, 4)} C`;

        }


        capacitance.slider.addEventListener(
            "input",
            update
        );

        voltage.slider.addEventListener(
            "input",
            update
        );


        update();

    }


    /* =====================================================
       11 — TRANSFORMER
    ===================================================== */

    function buildTransformer(card) {

        const area =
            getInteractiveArea(card);

        const controls =
            createElement(
                "div",
                "value-controls"
            );


        const primaryVoltage =
            createSlider(
                "Primary Voltage",
                1,
                600,
                1,
                240,
                " V"
            );


        const primaryTurns =
            createSlider(
                "Primary Turns",
                10,
                1000,
                10,
                500
            );


        const secondaryTurns =
            createSlider(
                "Secondary Turns",
                10,
                1000,
                10,
                250
            );


        controls.appendChild(
            primaryVoltage.wrapper
        );

        controls.appendChild(
            primaryTurns.wrapper
        );

        controls.appendChild(
            secondaryTurns.wrapper
        );


        const results =
            createElement(
                "div",
                "value-results"
            );


        const secondaryVoltage =
            createResult(
                "Secondary Voltage",
                "0.00",
                " V"
            );


        const ratio =
            createResult(
                "Turns Ratio",
                "0.00"
            );


        results.appendChild(
            secondaryVoltage.result
        );

        results.appendChild(
            ratio.result
        );


        const equation =
            createElement(
                "div",
                "interactive-equation"
            );


        area.appendChild(controls);
        area.appendChild(results);
        area.appendChild(equation);


        function update() {

            const Vp =
                Number(
                    primaryVoltage.slider.value
                );


            const Np =
                Number(
                    primaryTurns.slider.value
                );


            const Ns =
                Number(
                    secondaryTurns.slider.value
                );


            const Vs =
                Vp *
                (Ns / Np);


            const turnsRatio =
                Np / Ns;


            secondaryVoltage.number.textContent =
                `${formatNumber(Vs)} V`;


            ratio.number.textContent =
                `${formatNumber(turnsRatio)}:1`;


            equation.textContent =
                `Vs = Vp × (Ns ÷ Np) = ${formatNumber(Vs)} V`;

        }


        primaryVoltage.slider.addEventListener(
            "input",
            update
        );

        primaryTurns.slider.addEventListener(
            "input",
            update
        );

        secondaryTurns.slider.addEventListener(
            "input",
            update
        );


        update();

    }


    /* =====================================================
       12 — THREE-PHASE POWER
    ===================================================== */

    function buildThreePhase(card) {

        const area =
            getInteractiveArea(card);

        const controls =
            createElement(
                "div",
                "value-controls"
            );


        const voltage =
            createSlider(
                "Line Voltage",
                1,
                600,
                1,
                480,
                " V"
            );


        const current =
            createSlider(
                "Line Current",
                0.1,
                100,
                0.1,
                20,
                " A"
            );


        const powerFactor =
            createSlider(
                "Power Factor",
                0.1,
                1,
                0.01,
                0.85
            );


        controls.appendChild(
            voltage.wrapper
        );

        controls.appendChild(
            current.wrapper
        );

        controls.appendChild(
            powerFactor.wrapper
        );


        const results =
            createElement(
                "div",
                "value-results"
            );


        const power =
            createResult(
                "Three-Phase Power",
                "0.00",
                " kW"
            );


        results.appendChild(
            power.result
        );


        const equation =
            createElement(
                "div",
                "interactive-equation"
            );


        area.appendChild(controls);
        area.appendChild(results);
        area.appendChild(equation);


        function update() {

            const V =
                Number(
                    voltage.slider.value
                );


            const I =
                Number(
                    current.slider.value
                );


            const PF =
                Number(
                    powerFactor.slider.value
                );


            const P =
                Math.sqrt(3) *
                V *
                I *
                PF;


            const kW =
                P / 1000;


            power.number.textContent =
                `${formatNumber(kW)} kW`;


            equation.textContent =
                `P = √3 × V × I × PF = ${formatNumber(kW)} kW`;

        }


        voltage.slider.addEventListener(
            "input",
            update
        );

        current.slider.addEventListener(
            "input",
            update
        );

        powerFactor.slider.addEventListener(
            "input",
            update
        );


        update();

    }


    /* =====================================================
       INITIALIZE ELECTRICAL VALUE CARDS
    ===================================================== */

    const cards =
        document.querySelectorAll(
            ".value-card"
        );


    if (cards.length >= 12) {

        buildOhmsLaw(cards[0]);

        buildAtomicStructure(cards[1]);

        buildPower(cards[2]);

        buildSeries(cards[3]);

        buildParallel(cards[4]);

        buildResistance(cards[5]);

        buildVoltageDrop(cards[6]);

        buildFrequency(cards[7]);

        buildInductance(cards[8]);

        buildCapacitance(cards[9]);

        buildTransformer(cards[10]);

        buildThreePhase(cards[11]);

    }


    /* =====================================================
       SCIENTIFIC CALCULATOR
    ===================================================== */

    const calculatorButtons =
        document.querySelectorAll(
            ".calculator-button"
        );


    const expressionDisplay =
        document.getElementById(
            "calculator-expression"
        );


    const resultDisplay =
        document.getElementById(
            "calculator-result"
        );


    const modeDisplay =
        document.getElementById(
            "calculator-mode"
        );


    /*
     * Stop only the calculator portion if the
     * calculator is not present.
     *
     * The sliders above have already initialized.
     */

    if (
        !expressionDisplay ||
        !resultDisplay
    ) {

        return;

    }


    let expression = "";

    let answer = 0;

    let memory = 0;

    let angleMode = "DEG";

    let secondMode = false;

    let justCalculated = false;


    /* =====================================================
       FORMAT CALCULATOR NUMBER
    ===================================================== */

    function formatCalculatorNumber(number) {

        if (!Number.isFinite(number)) {

            return "Error";

        }


        if (
            Math.abs(number) >= 1000000000 ||
            (
                Math.abs(number) > 0 &&
                Math.abs(number) < 0.000001
            )
        ) {

            return number.toExponential(6);

        }


        return parseFloat(
            Number(number).toFixed(10)
        ).toString();

    }


    /* =====================================================
       UPDATE CALCULATOR DISPLAY
    ===================================================== */

    function updateCalculatorDisplay() {

        expressionDisplay.textContent =
            expression;


        if (expression === "") {

            resultDisplay.textContent =
                "0";

        }

    }


    /* =====================================================
       NORMALIZE EXPRESSION
    ===================================================== */

    function normalizeExpression(input) {

        return input

            .replace(/×/g, "*")

            .replace(/÷/g, "/")

            .replace(/\^/g, "**")

            .replace(/π/g, "Math.PI");

    }


    /* =====================================================
       VALIDATE EXPRESSION
    ===================================================== */

    function isValidExpression(input) {

        const normalized =
            normalizeExpression(input);


        /*
         * Calculator expressions should contain
         * only numbers, operators, parentheses,
         * decimal points, and PI.
         */

        if (
            !/^[0-9+\-*/().\sA-Za-z*]+$/.test(
                normalized
            )
        ) {

            return false;

        }


        if (
            /[;={},[\]'"`<>\\:&|?!@$%_]/.test(
                normalized
            )
        ) {

            return false;

        }


        if (
            /\b(?:constructor|prototype|globalThis|window|document|eval|Function|process|require)\b/i.test(
                normalized
            )
        ) {

            return false;

        }


        /*
         * Only Math.PI is permitted.
         */

        const mathReferences =
            normalized.match(
                /Math\.[A-Za-z]+/g
            );


        if (mathReferences) {

            for (
                const reference
                of mathReferences
            ) {

                if (
                    reference !== "Math.PI"
                ) {

                    return false;

                }

            }

        }


        return true;

    }


    /* =====================================================
       EVALUATE EXPRESSION
    ===================================================== */

    function evaluateExpression(input) {

        if (!input) {

            return answer;

        }


        const normalized =
            normalizeExpression(input);


        if (
            !isValidExpression(input)
        ) {

            throw new Error(
                "Invalid expression"
            );

        }


        /*
         * Replace PI with a numeric value.
         *
         * This means the evaluated expression
         * never needs access to the Math object.
         */

        const safeExpression =
            normalized.replace(
                /Math\.PI/g,
                `(${Math.PI})`
            );


        /*
         * Only arithmetic is evaluated here.
         */

        return Function(
            `"use strict"; return (${safeExpression})`
        )();

    }


    /* =====================================================
       CALCULATE EXPRESSION
    ===================================================== */

    function calculateExpression() {

        if (
            expression === ""
        ) {

            return;

        }


        try {

            const result =
                evaluateExpression(
                    expression
                );


            if (
                !Number.isFinite(result)
            ) {

                throw new Error();

            }


            answer =
                result;


            resultDisplay.textContent =
                formatCalculatorNumber(
                    result
                );


            expression =
                formatCalculatorNumber(
                    result
                );


            justCalculated =
                true;

        }

        catch {

            resultDisplay.textContent =
                "Error";

            expression = "";

            justCalculated =
                false;

        }

    }


    /* =====================================================
       GET CURRENT VALUE
    ===================================================== */

    function getCurrentValue() {

        if (
            expression === ""
        ) {

            return answer;

        }


        try {

            const value =
                evaluateExpression(
                    expression
                );


            return Number(value);

        }

        catch {

            return answer;

        }

    }


    /* =====================================================
       ANGLE CONVERSION
    ===================================================== */

    function convertToRadians(value) {

        if (
            angleMode === "DEG"
        ) {

            return (
                value *
                Math.PI /
                180
            );

        }


        return value;

    }


    /* =====================================================
       APPEND VALUE
    ===================================================== */

    function appendValue(value) {

        if (
            justCalculated
        ) {

            /*
             * If a number/operator is entered after
             * a calculation, begin a new expression.
             */

            expression = "";

            justCalculated =
                false;

        }


        expression += value;


        expressionDisplay.textContent =
            expression;

    }


    /* =====================================================
       APPLY FUNCTION
    ===================================================== */

    function applyFunction(
        functionName,
        calculatorFunction,
        displayName = functionName
    ) {

        const value =
            getCurrentValue();


        try {

            const result =
                calculatorFunction(
                    value
                );


            if (
                !Number.isFinite(result)
            ) {

                throw new Error();

            }


            answer =
                result;


            expression =
                formatCalculatorNumber(
                    result
                );


            expressionDisplay.textContent =
                `${displayName}(${formatCalculatorNumber(value)})`;


            resultDisplay.textContent =
                formatCalculatorNumber(
                    result
                );


            justCalculated =
                true;

        }

        catch {

            expression = "";

            resultDisplay.textContent =
                "Error";


            expressionDisplay.textContent =
                `${displayName}(${formatCalculatorNumber(value)})`;


            justCalculated =
                false;

        }

    }


    /* =====================================================
       SECOND FUNCTION MAP
    ===================================================== */

    function getSecondAction(action) {

        const secondFunctions = {

            sin: "asin",

            cos: "acos",

            tan: "atan",

            log: "pow10",

            ln: "exp",

            sqrt: "cubeRoot",

            square: "cube",

            reciprocal: "negative"

        };


        return (
            secondFunctions[action] ||
            null
        );

    }


    /* =====================================================
       SECOND MODE VISUAL STATE
    ===================================================== */

    function clearSecondMode() {

        secondMode =
            false;


        calculatorButtons.forEach(
            button => {

                button.classList.remove(
                    "active"
                );

            }
        );

    }


    /* =====================================================
       CALCULATOR BUTTONS
    ===================================================== */

    calculatorButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const value =
                        button.dataset.value;

                    let action =
                        button.dataset.action;


                    /* =============================================
                       NUMBER / OPERATOR / PARENTHESIS
                    ============================================= */

                    if (
                        value !== undefined
                    ) {

                        appendValue(
                            value
                        );

                        return;

                    }


                    /* =============================================
                       SECOND
                    ============================================= */

                    if (
                        action === "second"
                    ) {

                        secondMode =
                            !secondMode;


                        button.classList.toggle(
                            "active",
                            secondMode
                        );


                        return;

                    }


                    /* =============================================
                       SECOND-MODE FUNCTIONS
                    ============================================= */

                    if (
                        secondMode
                    ) {

                        const secondAction =
                            getSecondAction(
                                action
                            );


                        if (
                            secondAction
                        ) {

                            clearSecondMode();


                            /* -------------------------------------
                               ARC SINE
                            ------------------------------------- */

                            if (
                                secondAction === "asin"
                            ) {

                                applyFunction(
                                    "asin",
                                    value => {

                                        const result =
                                            Math.asin(
                                                value
                                            );


                                        return angleMode === "DEG"
                                            ? result * 180 / Math.PI
                                            : result;

                                    }
                                );


                                return;

                            }


                            /* -------------------------------------
                               ARC COSINE
                            ------------------------------------- */

                            if (
                                secondAction === "acos"
                            ) {

                                applyFunction(
                                    "acos",
                                    value => {

                                        const result =
                                            Math.acos(
                                                value
                                            );


                                        return angleMode === "DEG"
                                            ? result * 180 / Math.PI
                                            : result;

                                    }
                                );


                                return;

                            }


                            /* -------------------------------------
                               ARC TANGENT
                            ------------------------------------- */

                            if (
                                secondAction === "atan"
                            ) {

                                applyFunction(
                                    "atan",
                                    value => {

                                        const result =
                                            Math.atan(
                                                value
                                            );


                                        return angleMode === "DEG"
                                            ? result * 180 / Math.PI
                                            : result;

                                    }
                                );


                                return;

                            }


                            /* -------------------------------------
                               10^X
                            ------------------------------------- */

                            if (
                                secondAction === "pow10"
                            ) {

                                applyFunction(
                                    "10^x",
                                    value =>
                                        Math.pow(
                                            10,
                                            value
                                        )
                                );


                                return;

                            }


                            /* -------------------------------------
                               E^X
                            ------------------------------------- */

                            if (
                                secondAction === "exp"
                            ) {

                                applyFunction(
                                    "e^x",
                                    value =>
                                        Math.exp(
                                            value
                                        )
                                );


                                return;

                            }


                            /* -------------------------------------
                               CUBE ROOT
                            ------------------------------------- */

                            if (
                                secondAction === "cubeRoot"
                            ) {

                                applyFunction(
                                    "∛",
                                    value =>
                                        Math.cbrt(
                                            value
                                        )
                                );


                                return;

                            }


                            /* -------------------------------------
                               CUBE
                            ------------------------------------- */

                            if (
                                secondAction === "cube"
                            ) {

                                applyFunction(
                                    "cube",
                                    value =>
                                        value *
                                        value *
                                        value
                                );


                                return;

                            }


                            /* -------------------------------------
                               NEGATIVE
                            ------------------------------------- */

                            if (
                                secondAction === "negative"
                            ) {

                                applyFunction(
                                    "neg",
                                    value =>
                                        -value
                                );


                                return;

                            }

                        }

                    }


                    /* =============================================
                       MODE
                    ============================================= */

                    if (
                        action === "mode"
                    ) {

                        angleMode =
                            angleMode === "DEG"
                                ? "RAD"
                                : "DEG";


                        if (
                            modeDisplay
                        ) {

                            modeDisplay.textContent =
                                angleMode;

                        }


                        return;

                    }


                    /* =============================================
                       DELETE
                    ============================================= */

                    if (
                        action === "delete"
                    ) {

                        expression =
                            expression.slice(
                                0,
                                -1
                            );


                        justCalculated =
                            false;


                        expressionDisplay.textContent =
                            expression;


                        if (
                            expression === ""
                        ) {

                            resultDisplay.textContent =
                                "0";

                        }


                        return;

                    }


                    /* =============================================
                       CLEAR
                    ============================================= */

                    if (
                        action === "clear"
                    ) {

                        expression = "";

                        answer = 0;

                        justCalculated =
                            false;


                        expressionDisplay.textContent =
                            "";


                        resultDisplay.textContent =
                            "0";


                        clearSecondMode();


                        return;

                    }


                    /* =============================================
                       EQUALS
                    ============================================= */

                    if (
                        action === "equals"
                    ) {

                        calculateExpression();


                        expressionDisplay.textContent =
                            expression;


                        return;

                    }


                    /* =============================================
                       PI
                    ============================================= */

                    if (
                        action === "pi"
                    ) {

                        if (
                            justCalculated
                        ) {

                            expression = "";

                            justCalculated =
                                false;

                        }


                        expression +=
                            "π";


                        expressionDisplay.textContent =
                            expression;


                        return;

                    }


                    /* =============================================
                       ANS
                    ============================================= */

                    if (
                        action === "ans"
                    ) {

                        if (
                            justCalculated
                        ) {

                            expression = "";

                            justCalculated =
                                false;

                        }


                        expression +=
                            formatCalculatorNumber(
                                answer
                            );


                        expressionDisplay.textContent =
                            expression;


                        return;

                    }


                    /* =============================================
                       SIN
                    ============================================= */

                    if (
                        action === "sin"
                    ) {

                        applyFunction(
                            "sin",
                            value =>
                                Math.sin(
                                    convertToRadians(
                                        value
                                    )
                                )
                        );


                        return;

                    }


                    /* =============================================
                       COS
                    ============================================= */

                    if (
                        action === "cos"
                    ) {

                        applyFunction(
                            "cos",
                            value =>
                                Math.cos(
                                    convertToRadians(
                                        value
                                    )
                                )
                        );


                        return;

                    }


                    /* =============================================
                       TAN
                    ============================================= */

                    if (
                        action === "tan"
                    ) {

                        applyFunction(
                            "tan",
                            value =>
                                Math.tan(
                                    convertToRadians(
                                        value
                                    )
                                )
                        );


                        return;

                    }


                    /* =============================================
                       LOG
                    ============================================= */

                    if (
                        action === "log"
                    ) {

                        applyFunction(
                            "log",
                            value =>
                                Math.log10(
                                    value
                                )
                        );


                        return;

                    }


                    /* =============================================
                       LN
                    ============================================= */

                    if (
                        action === "ln"
                    ) {

                        applyFunction(
                            "ln",
                            value =>
                                Math.log(
                                    value
                                )
                        );


                        return;

                    }


                    /* =============================================
                       SQUARE ROOT
                    ============================================= */

                    if (
                        action === "sqrt"
                    ) {

                        applyFunction(
                            "√",
                            value =>
                                Math.sqrt(
                                    value
                                )
                        );


                        return;

                    }


                    /* =============================================
                       SQUARE
                    ============================================= */

                    if (
                        action === "square"
                    ) {

                        applyFunction(
                            "x²",
                            value =>
                                value *
                                value
                        );


                        return;

                    }


                    /* =============================================
                       POWER
                    ============================================= */

                    if (
                        action === "power"
                    ) {

                        appendValue("^");

                        return;

                    }


                    /* =============================================
                       RECIPROCAL
                    ============================================= */

                    if (
                        action === "reciprocal"
                    ) {

                        applyFunction(
                            "1/x",
                            value =>
                                1 / value
                        );


                        return;

                    }


                    /* =============================================
                       SCIENTIFIC NOTATION
                    ============================================= */

                    if (
                        action === "scientific"
                    ) {

                        const value =
                            getCurrentValue();


                        if (
                            !Number.isFinite(
                                value
                            )
                        ) {

                            resultDisplay.textContent =
                                "Error";

                            return;

                        }


                        answer =
                            value;


                        expression =
                            value.toExponential(
                                6
                            );


                        expressionDisplay.textContent =
                            "Scientific Notation";


                        resultDisplay.textContent =
                            expression;


                        justCalculated =
                            true;


                        return;

                    }


                    /* =============================================
                       MEMORY CLEAR
                    ============================================= */

                    if (
                        action === "memory-clear"
                    ) {

                        memory = 0;


                        resultDisplay.textContent =
                            "Memory Cleared";


                        return;

                    }


                    /* =============================================
                       MEMORY RECALL
                    ============================================= */

                    if (
                        action === "memory-recall"
                    ) {

                        appendValue(
                            formatCalculatorNumber(
                                memory
                            )
                        );


                        return;

                    }


                    /* =============================================
                       MEMORY STORE
                    ============================================= */

                    if (
                        action === "memory-store" ||
                        action === "memory-save"
                    ) {

                        memory =
                            getCurrentValue();


                        resultDisplay.textContent =
                            "Memory Stored";


                        return;

                    }


                    /* =============================================
                       MEMORY ADD
                    ============================================= */

                    if (
                        action === "memory-add"
                    ) {

                        memory +=
                            getCurrentValue();


                        resultDisplay.textContent =
                            "Memory Updated";


                        return;

                    }


                    /* =============================================
                       MEMORY SUBTRACT
                    ============================================= */

                    if (
                        action === "memory-subtract"
                    ) {

                        memory -=
                            getCurrentValue();


                        resultDisplay.textContent =
                            "Memory Updated";


                        return;

                    }

                }
            );

        }
    );


    /* =====================================================
       KEYBOARD SUPPORT
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            /*
             * Don't let the calculator keyboard handler
             * interfere with range sliders or other inputs.
             */

            const activeElement =
                document.activeElement;


            if (
                activeElement &&
                (
                    activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA" ||
                    activeElement.tagName === "SELECT"
                )
            ) {

                return;

            }


            const key =
                event.key;


            /* -------------------------------------------------
               NUMBERS
            ------------------------------------------------- */

            if (
                /^[0-9]$/.test(key)
            ) {

                appendValue(key);

                return;

            }


            /* -------------------------------------------------
               OPERATORS
            ------------------------------------------------- */

            if (
                [
                    "+",
                    "-",
                    "*",
                    "/",
                    ".",
                    "(",
                    ")"
                ].includes(key)
            ) {

                appendValue(key);

                return;

            }


            /* -------------------------------------------------
               POWER
            ------------------------------------------------- */

            if (
                key === "^"
            ) {

                appendValue("^");

                return;

            }


            /* -------------------------------------------------
               ENTER
            ------------------------------------------------- */

            if (
                key === "Enter"
            ) {

                event.preventDefault();


                calculateExpression();


                expressionDisplay.textContent =
                    expression;


                return;

            }


            /* -------------------------------------------------
               BACKSPACE
            ------------------------------------------------- */

            if (
                key === "Backspace"
            ) {

                event.preventDefault();


                expression =
                    expression.slice(
                        0,
                        -1
                    );


                justCalculated =
                    false;


                expressionDisplay.textContent =
                    expression;


                if (
                    expression === ""
                ) {

                    resultDisplay.textContent =
                        "0";

                }


                return;

            }


            /* -------------------------------------------------
               ESCAPE
            ------------------------------------------------- */

            if (
                key === "Escape"
            ) {

                expression = "";

                answer = 0;

                justCalculated =
                    false;


                expressionDisplay.textContent =
                    "";


                resultDisplay.textContent =
                    "0";


                clearSecondMode();


                return;

            }


            /* -------------------------------------------------
               PI
            ------------------------------------------------- */

            if (
                key.toLowerCase() === "p"
            ) {

                appendValue("π");

                return;

            }

        }
    );


    /* =====================================================
       INITIAL CALCULATOR DISPLAY
    ===================================================== */

    updateCalculatorDisplay();

});