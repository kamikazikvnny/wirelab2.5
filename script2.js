/* =========================================================
   WIRELAB
   ELECTRICAL VALUES
   Interactive Learning Widgets + Scientific Calculator
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       GLOBAL HELPERS
    ===================================================== */

    function createElement(tag, className = "", text = "") {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== "") {
            element.textContent = text;
        }

        return element;
    }

    function createSlider(label, min, max, step, value, unit = "") {
        const wrapper = createElement("div", "value-control");

        const labelRow = createElement("div", "value-control-label");

        const labelText = createElement("span", "", label);
        const numberText = createElement(
            "span",
            "value-control-number",
            `${value}${unit}`
        );

        labelRow.appendChild(labelText);
        labelRow.appendChild(numberText);

        const slider = document.createElement("input");

        slider.type = "range";
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = value;

        wrapper.appendChild(labelRow);
        wrapper.appendChild(slider);

        return {
            wrapper,
            slider,
            number: numberText
        };
    }

    function createControlArea() {
        return createElement("div", "value-controls");
    }

    function createResults() {
        return createElement("div", "value-results");
    }

    function createResult(label, value = "") {
        const result = createElement("div", "value-result");

        const labelElement = createElement(
            "div",
            "value-result-label",
            label
        );

        const numberElement = createElement(
            "div",
            "value-result-number",
            value
        );

        result.appendChild(labelElement);
        result.appendChild(numberElement);

        return {
            element: result,
            number: numberElement
        };
    }

    function createEquation(text) {
        return createElement(
            "div",
            "interactive-equation",
            text
        );
    }

    function formatNumber(number, decimals = 2) {
        if (!Number.isFinite(number)) {
            return "—";
        }

        if (Math.abs(number) >= 1000 || Math.abs(number) < 0.01) {
            return number.toExponential(3);
        }

        return Number(number.toFixed(decimals)).toLocaleString();
    }

    function getInteractiveArea(card) {
        let area = card.querySelector(".interactive-value");

        if (!area) {
            area = createElement("div", "interactive-value");
            card.appendChild(area);
        }

        return area;
    }


    /* =====================================================
       1. OHM'S LAW
    ===================================================== */

    function buildOhmsLaw(card) {

        const area = getInteractiveArea(card);

        const controls = createControlArea();

        const voltage = createSlider(
            "Voltage",
            1,
            240,
            1,
            120,
            " V"
        );

        const resistance = createSlider(
            "Resistance",
            1,
            100,
            1,
            20,
            " Ω"
        );

        controls.appendChild(voltage.wrapper);
        controls.appendChild(resistance.wrapper);

        const results = createResults();

        const current = createResult("Current");
        const power = createResult("Power");

        results.appendChild(current.element);
        results.appendChild(power.element);

        const equation = createEquation(
            "Ohm's Law: I = V ÷ R"
        );

        area.appendChild(controls);
        area.appendChild(results);
        area.appendChild(equation);

        function update() {

            const V = Number(voltage.slider.value);
            const R = Number(resistance.slider.value);

            const I = V / R;
            const P = V * I;

            voltage.number.textContent = `${V} V`;
            resistance.number.textContent = `${R} Ω`;

            current.number.textContent =
                `${formatNumber(I)} A`;

            power.number.textContent =
                `${formatNumber(P)} W`;
        }

        voltage.slider.addEventListener("input", update);
        resistance.slider.addEventListener("input", update);

        update();
    }


    /* =====================================================
       2. ATOMIC STRUCTURE
    ===================================================== */

    function buildAtomicStructure(card) {

        const area = getInteractiveArea(card);

        const controls = createControlArea();

        const protons = createSlider(
            "Protons",
            1,
            20,
            1,
            6
        );

        const neutrons = createSlider(
            "Neutrons",
            0,
            20,
            1,
            6
        );

        const electrons = createSlider(
            "Electrons",
            1,
            20,
            1,
            6
        );

        controls.appendChild(protons.wrapper);
        controls.appendChild(neutrons.wrapper);
        controls.appendChild(electrons.wrapper);

        const atom = createElement(
            "div",
            "interactive-atom"
        );

        const nucleus = createElement(
            "div",
            "interactive-nucleus"
        );

        const particleValues = createElement(
            "div",
            "atom-particle-values"
        );

        atom.appendChild(nucleus);

        const results = createResults();

        const massNumber = createResult("Mass Number");
        const charge = createResult("Net Charge");

        results.appendChild(massNumber.element);
        results.appendChild(charge.element);

        area.appendChild(controls);
        area.appendChild(atom);
        area.appendChild(particleValues);
        area.appendChild(results);

        function update() {

            const p = Number(protons.slider.value);
            const n = Number(neutrons.slider.value);
            const e = Number(electrons.slider.value);

            protons.number.textContent = p;
            neutrons.number.textContent = n;
            electrons.number.textContent = e;

            nucleus.innerHTML = "";

            for (let i = 0; i < p; i++) {
                const proton = createElement(
                    "div",
                    "proton",
                    "+"
                );

                nucleus.appendChild(proton);
            }

            for (let i = 0; i < n; i++) {
                const neutron = createElement(
                    "div",
                    "neutron",
                    "0"
                );

                nucleus.appendChild(neutron);
            }

            particleValues.textContent =
                `Protons: ${p} | Neutrons: ${n} | Electrons: ${e}`;

            massNumber.number.textContent = p + n;

            const netCharge = p - e;

            if (netCharge > 0) {
                charge.number.textContent = `+${netCharge}`;
            } else {
                charge.number.textContent = netCharge;
            }
        }

        protons.slider.addEventListener("input", update);
        neutrons.slider.addEventListener("input", update);
        electrons.slider.addEventListener("input", update);

        update();
    }


    /* =====================================================
       3. ELECTRICAL POWER
    ===================================================== */

    function buildPower(card) {

        const area = getInteractiveArea(card);

        const controls = createControlArea();

        const voltage = createSlider(
            "Voltage",
            1,
            240,
            1,
            120,
            " V"
        );

        const current = createSlider(
            "Current",
            0.1,
            30,
            0.1,
            10,
            " A"
        );

        controls.appendChild(voltage.wrapper);
        controls.appendChild(current.wrapper);

        const results = createResults();

        const power = createResult("Power");

        results.appendChild(power.element);

        area.appendChild(controls);
        area.appendChild(results);

        area.appendChild(
            createEquation("P = V × I")
        );

        function update() {

            const V = Number(voltage.slider.value);
            const I = Number(current.slider.value);

            const P = V * I;

            voltage.number.textContent = `${V} V`;
            current.number.textContent = `${I} A`;

            power.number.textContent =
                `${formatNumber(P)} W`;
        }

        voltage.slider.addEventListener("input", update);
        current.slider.addEventListener("input", update);

        update();
    }


    /* =====================================================
       4. SERIES CIRCUIT
    ===================================================== */

    function buildSeries(card) {

        const area = getInteractiveArea(card);

        const controls = createControlArea();

        const r1 = createSlider(
            "Resistance 1",
            1,
            100,
            1,
            10,
            " Ω"
        );

        const r2 = createSlider(
            "Resistance 2",
            1,
            100,
            1,
            20,
            " Ω"
        );

        const voltage = createSlider(
            "Voltage",
            1,
            240,
            1,
            120,
            " V"
        );

        controls.appendChild(r1.wrapper);
        controls.appendChild(r2.wrapper);
        controls.appendChild(voltage.wrapper);

        const results = createResults();

        const totalResistance =
            createResult("Total Resistance");

        const current =
            createResult("Circuit Current");

        results.appendChild(totalResistance.element);
        results.appendChild(current.element);

        area.appendChild(controls);
        area.appendChild(results);

        area.appendChild(
            createEquation("RT = R1 + R2")
        );

        function update() {

            const R1 = Number(r1.slider.value);
            const R2 = Number(r2.slider.value);
            const V = Number(voltage.slider.value);

            const RT = R1 + R2;
            const I = V / RT;

            r1.number.textContent = `${R1} Ω`;
            r2.number.textContent = `${R2} Ω`;
            voltage.number.textContent = `${V} V`;

            totalResistance.number.textContent =
                `${formatNumber(RT)} Ω`;

            current.number.textContent =
                `${formatNumber(I)} A`;
        }

        r1.slider.addEventListener("input", update);
        r2.slider.addEventListener("input", update);
        voltage.slider.addEventListener("input", update);

        update();
    }


    /* =====================================================
       5. PARALLEL CIRCUIT
    ===================================================== */

    function buildParallel(card) {

        const area = getInteractiveArea(card);

        const controls = createControlArea();

        const r1 = createSlider(
            "Resistance 1",
            1,
            100,
            1,
            10,
            " Ω"
        );

        const r2 = createSlider(
            "Resistance 2",
            1,
            100,
            1,
            20,
            " Ω"
        );

        const voltage = createSlider(
            "Voltage",
            1,
            240,
            1,
            120,
            " V"
        );

        controls.appendChild(r1.wrapper);
        controls.appendChild(r2.wrapper);
        controls.appendChild(voltage.wrapper);

        const results = createResults();

        const totalResistance =
            createResult("Total Resistance");

        const totalCurrent =
            createResult("Total Current");

        results.appendChild(totalResistance.element);
        results.appendChild(totalCurrent.element);

        area.appendChild(controls);
        area.appendChild(results);

        area.appendChild(
            createEquation(
                "RT = (R1 × R2) ÷ (R1 + R2)"
            )
        );

        function update() {

            const R1 = Number(r1.slider.value);
            const R2 = Number(r2.slider.value);
            const V = Number(voltage.slider.value);

            const RT =
                (R1 * R2) /
                (R1 + R2);

            const I = V / RT;

            r1.number.textContent = `${R1} Ω`;
            r2.number.textContent = `${R2} Ω`;
            voltage.number.textContent = `${V} V`;

            totalResistance.number.textContent =
                `${formatNumber(RT)} Ω`;

            totalCurrent.number.textContent =
                `${formatNumber(I)} A`;
        }

        r1.slider.addEventListener("input", update);
        r2.slider.addEventListener("input", update);
        voltage.slider.addEventListener("input", update);

        update();
    }


    /* =====================================================
       6. RESISTANCE
    ===================================================== */

    function buildResistance(card) {

        const area = getInteractiveArea(card);

        const controls = createControlArea();

        const resistivity = createSlider(
            "Copper Resistivity",
            0.001,
            0.030,
            0.0001,
            0.0172
        );

        const length = createSlider(
            "Length",
            1,
            100,
            1,
            20,
            " m"
        );

        const areaSize = createSlider(
            "Conductor Area",
            0.5,
            10,
            0.1,
            2,
            " mm²"
        );

        controls.appendChild(resistivity.wrapper);
        controls.appendChild(length.wrapper);
        controls.appendChild(areaSize.wrapper);

        const results = createResults();

        const resistance = createResult("Resistance");

        results.appendChild(resistance.element);

        area.appendChild(controls);
        area.appendChild(results);

        area.appendChild(
            createEquation("R = ρL ÷ A")
        );

        function update() {

            const rho =
                Number(resistivity.slider.value);

            const L =
                Number(length.slider.value);

            const A =
                Number(areaSize.slider.value);

            const R =
                (rho * L) / A;

            resistivity.number.textContent =
                rho.toFixed(4);

            length.number.textContent =
                `${L} m`;

            areaSize.number.textContent =
                `${A} mm²`;

            resistance.number.textContent =
                `${formatNumber(R)} Ω`;
        }

        resistivity.slider.addEventListener("input", update);
        length.slider.addEventListener("input", update);
        areaSize.slider.addEventListener("input", update);

        update();
    }


    /* =====================================================
       7. VOLTAGE DROP
    ===================================================== */

    function buildVoltageDrop(card) {

        const area = getInteractiveArea(card);

        const controls = createControlArea();

        const current = createSlider(
            "Current",
            0.1,
            30,
            0.1,
            10,
            " A"
        );

        const resistance = createSlider(
            "Circuit Resistance",
            0.01,
            10,
            0.01,
            1,
            " Ω"
        );

        const voltage = createSlider(
            "Source Voltage",
            1,
            240,
            1,
            120,
            " V"
        );

        controls.appendChild(current.wrapper);
        controls.appendChild(resistance.wrapper);
        controls.appendChild(voltage.wrapper);

        const results = createResults();

        const drop = createResult("Voltage Drop");
        const remaining = createResult("Load Voltage");

        results.appendChild(drop.element);
        results.appendChild(remaining.element);

        area.appendChild(controls);
        area.appendChild(results);

        area.appendChild(
            createEquation("Vdrop = I × R")
        );

        function update() {

            const I = Number(current.slider.value);
            const R = Number(resistance.slider.value);
            const V = Number(voltage.slider.value);

            const Vdrop = I * R;
            const loadVoltage =
                Math.max(0, V - Vdrop);

            current.number.textContent =
                `${I} A`;

            resistance.number.textContent =
                `${R} Ω`;

            voltage.number.textContent =
                `${V} V`;

            drop.number.textContent =
                `${formatNumber(Vdrop)} V`;

            remaining.number.textContent =
                `${formatNumber(loadVoltage)} V`;
        }

        current.slider.addEventListener("input", update);
        resistance.slider.addEventListener("input", update);
        voltage.slider.addEventListener("input", update);

        update();
    }


    /* =====================================================
       8. AC FREQUENCY
    ===================================================== */

    function buildFrequency(card) {

        const area = getInteractiveArea(card);

        const controls = createControlArea();

        const frequency = createSlider(
            "Frequency",
            1,
            120,
            1,
            60,
            " Hz"
        );

        controls.appendChild(frequency.wrapper);

        const waveform =
            createElement("div", "ac-waveform");

        const waveLine =
            createElement("div", "wave-line");

        waveform.appendChild(waveLine);

        const results = createResults();

        const period =
            createResult("Period");

        results.appendChild(period.element);

        area.appendChild(controls);
        area.appendChild(waveform);
        area.appendChild(results);

        area.appendChild(
            createEquation("T = 1 ÷ f")
        );

        function update() {

            const f =
                Number(frequency.slider.value);

            const T = 1 / f;

            frequency.number.textContent =
                `${f} Hz`;

            period.number.textContent =
                `${formatNumber(T, 4)} s`;

            waveLine.style.animationDuration =
                `${Math.max(0.15, 2 / f)}s`;
        }

        frequency.slider.addEventListener("input", update);

        update();
    }


    /* =====================================================
       9. INDUCTANCE
    ===================================================== */

    function buildInductance(card) {

        const area = getInteractiveArea(card);

        const controls = createControlArea();

        const inductance = createSlider(
            "Inductance",
            1,
            500,
            1,
            100,
            " mH"
        );

        const frequency = createSlider(
            "Frequency",
            1,
            1000,
            1,
            60,
            " Hz"
        );

        controls.appendChild(inductance.wrapper);
        controls.appendChild(frequency.wrapper);

        const results = createResults();

        const reactance =
            createResult("Inductive Reactance");

        results.appendChild(reactance.element);

        area.appendChild(controls);
        area.appendChild(results);

        area.appendChild(
            createEquation("XL = 2πfL")
        );

        function update() {

            const LmH =
                Number(inductance.slider.value);

            const f =
                Number(frequency.slider.value);

            const L = LmH / 1000;

            const XL =
                2 * Math.PI * f * L;

            inductance.number.textContent =
                `${LmH} mH`;

            frequency.number.textContent =
                `${f} Hz`;

            reactance.number.textContent =
                `${formatNumber(XL)} Ω`;
        }

        inductance.slider.addEventListener("input", update);
        frequency.slider.addEventListener("input", update);

        update();
    }


    /* =====================================================
       10. CAPACITANCE
    ===================================================== */

    function buildCapacitance(card) {

        const area = getInteractiveArea(card);

        const controls = createControlArea();

        const capacitance = createSlider(
            "Capacitance",
            1,
            1000,
            1,
            100,
            " µF"
        );

        const voltage = createSlider(
            "Voltage",
            1,
            240,
            1,
            120,
            " V"
        );

        controls.appendChild(capacitance.wrapper);
        controls.appendChild(voltage.wrapper);

        const results = createResults();

        const charge =
            createResult("Stored Charge");

        results.appendChild(charge.element);

        area.appendChild(controls);
        area.appendChild(results);

        area.appendChild(
            createEquation("Q = C × V")
        );

        function update() {

            const Cmicro =
                Number(capacitance.slider.value);

            const V =
                Number(voltage.slider.value);

            const C =
                Cmicro / 1000000;

            const Q =
                C * V;

            capacitance.number.textContent =
                `${Cmicro} µF`;

            voltage.number.textContent =
                `${V} V`;

            charge.number.textContent =
                `${formatNumber(Q, 6)} C`;
        }

        capacitance.slider.addEventListener("input", update);
        voltage.slider.addEventListener("input", update);

        update();
    }


    /* =====================================================
       11. TRANSFORMER TURNS RATIO
    ===================================================== */

    function buildTransformer(card) {

        const area = getInteractiveArea(card);

        const controls = createControlArea();

        const primaryVoltage = createSlider(
            "Primary Voltage",
            1,
            480,
            1,
            240,
            " V"
        );

        const primaryTurns = createSlider(
            "Primary Turns",
            1,
            1000,
            1,
            500
        );

        const secondaryTurns = createSlider(
            "Secondary Turns",
            1,
            1000,
            1,
            100
        );

        controls.appendChild(primaryVoltage.wrapper);
        controls.appendChild(primaryTurns.wrapper);
        controls.appendChild(secondaryTurns.wrapper);

        const results = createResults();

        const secondaryVoltage =
            createResult("Secondary Voltage");

        const ratio =
            createResult("Turns Ratio");

        results.appendChild(secondaryVoltage.element);
        results.appendChild(ratio.element);

        area.appendChild(controls);
        area.appendChild(results);

        area.appendChild(
            createEquation("Vs = Vp × Ns ÷ Np")
        );

        function update() {

            const Vp =
                Number(primaryVoltage.slider.value);

            const Np =
                Number(primaryTurns.slider.value);

            const Ns =
                Number(secondaryTurns.slider.value);

            const Vs =
                Vp * (Ns / Np);

            const turnsRatio =
                Ns / Np;

            primaryVoltage.number.textContent =
                `${Vp} V`;

            primaryTurns.number.textContent =
                Np;

            secondaryTurns.number.textContent =
                Ns;

            secondaryVoltage.number.textContent =
                `${formatNumber(Vs)} V`;

            ratio.number.textContent =
                `${formatNumber(turnsRatio, 3)} : 1`;
        }

        primaryVoltage.slider.addEventListener("input", update);
        primaryTurns.slider.addEventListener("input", update);
        secondaryTurns.slider.addEventListener("input", update);

        update();
    }


    /* =====================================================
       12. THREE-PHASE POWER
    ===================================================== */

    function buildThreePhase(card) {

        const area = getInteractiveArea(card);

        const controls = createControlArea();

        const voltage = createSlider(
            "Line Voltage",
            1,
            600,
            1,
            240,
            " V"
        );

        const current = createSlider(
            "Line Current",
            0.1,
            100,
            0.1,
            20,
            " A"
        );

        const powerFactor = createSlider(
            "Power Factor",
            0.1,
            1,
            0.01,
            0.8
        );

        controls.appendChild(voltage.wrapper);
        controls.appendChild(current.wrapper);
        controls.appendChild(powerFactor.wrapper);

        const results = createResults();

        const power =
            createResult("Three-Phase Power");

        results.appendChild(power.element);

        area.appendChild(controls);
        area.appendChild(results);

        area.appendChild(
            createEquation(
                "P = √3 × V × I × PF"
            )
        );

        function update() {

            const V =
                Number(voltage.slider.value);

            const I =
                Number(current.slider.value);

            const PF =
                Number(powerFactor.slider.value);

            const P =
                Math.sqrt(3) *
                V *
                I *
                PF;

            voltage.number.textContent =
                `${V} V`;

            current.number.textContent =
                `${I} A`;

            powerFactor.number.textContent =
                PF.toFixed(2);

            power.number.textContent =
                `${formatNumber(P / 1000)} kW`;
        }

        voltage.slider.addEventListener("input", update);
        current.slider.addEventListener("input", update);
        powerFactor.slider.addEventListener("input", update);

        update();
    }


    /* =====================================================
       BUILD THE 12 ELECTRICAL VALUE WIDGETS
    ===================================================== */

    const cards =
        document.querySelectorAll(".value-card");

    const builders = [
        buildOhmsLaw,
        buildAtomicStructure,
        buildPower,
        buildSeries,
        buildParallel,
        buildResistance,
        buildVoltageDrop,
        buildFrequency,
        buildInductance,
        buildCapacitance,
        buildTransformer,
        buildThreePhase
    ];

    cards.forEach((card, index) => {

        if (builders[index]) {
            builders[index](card);
        }

    });


    /* =====================================================
       SCIENTIFIC CALCULATOR
    ===================================================== */

    const calculator =
        document.querySelector(".scientific-calculator");

    if (calculator) {

        const modeDisplay =
            document.getElementById("calculator-mode");

        const expressionDisplay =
            document.getElementById("calculator-expression");

        const resultDisplay =
            document.getElementById("calculator-result");


        let expression = "";
        let answer = 0;
        let memory = 0;
        let degreeMode = true;
        let secondFunction = false;
        let justCalculated = false;


        /* =================================================
           DISPLAY
        ================================================= */

        function updateCalculatorDisplay() {

            expressionDisplay.textContent =
                expression || "0";

            resultDisplay.textContent =
                answer === "" ? "0" : answer;

            modeDisplay.textContent =
                degreeMode ? "DEG" : "RAD";
        }


        /* =================================================
           SAFE NUMBER FORMAT
        ================================================= */

        function formatCalculatorNumber(value) {

            if (!Number.isFinite(value)) {
                return "Error";
            }

            if (
                Math.abs(value) >= 1e10 ||
                (Math.abs(value) > 0 && Math.abs(value) < 1e-8)
            ) {
                return value.toExponential(8);
            }

            return Number(
                value.toPrecision(12)
            ).toString();
        }


        /* =================================================
           TRIG FUNCTIONS
        ================================================= */

        function sin(value) {

            return degreeMode
                ? Math.sin(value * Math.PI / 180)
                : Math.sin(value);
        }

        function cos(value) {

            return degreeMode
                ? Math.cos(value * Math.PI / 180)
                : Math.cos(value);
        }

        function tan(value) {

            return degreeMode
                ? Math.tan(value * Math.PI / 180)
                : Math.tan(value);
        }


        /* =================================================
           EXPRESSION CONVERTER
        ================================================= */

        function prepareExpression(input) {

            let converted = input;

            converted = converted
                .replace(/π/g, "Math.PI")
                .replace(/\^/g, "**")
                .replace(/×/g, "*")
                .replace(/÷/g, "/");

            converted = converted.replace(
                /(\d+(?:\.\d+)?)%/g,
                "($1/100)"
            );

            converted = converted.replace(
                /√\(/g,
                "Math.sqrt("
            );

            return converted;
        }


        /* =================================================
           CALCULATE EXPRESSION
        ================================================= */

        function calculateExpression(input) {

            if (!input) {
                return 0;
            }

            let prepared =
                prepareExpression(input);

            prepared = prepared.replace(
                /sin\(/g,
                "SIN("
            );

            prepared = prepared.replace(
                /cos\(/g,
                "COS("
            );

            prepared = prepared.replace(
                /tan\(/g,
                "TAN("
            );

            prepared = prepared.replace(
                /log\(/g,
                "LOG("
            );

            prepared = prepared.replace(
                /ln\(/g,
                "LN("
            );

            prepared = prepared.replace(
                /sqrt\(/g,
                "SQRT("
            );

            prepared = prepared.replace(
                /SIN\(/g,
                "sin("
            );

            prepared = prepared.replace(
                /COS\(/g,
                "cos("
            );

            prepared = prepared.replace(
                /TAN\(/g,
                "tan("
            );

            prepared = prepared.replace(
                /LOG\(/g,
                "Math.log10("
            );

            prepared = prepared.replace(
                /LN\(/g,
                "Math.log("
            );

            prepared = prepared.replace(
                /SQRT\(/g,
                "Math.sqrt("
            );


            try {

                const fn = new Function(
                    "sin",
                    "cos",
                    "tan",
                    `
                    return (${prepared});
                    `
                );

                const result =
                    fn(sin, cos, tan);

                if (!Number.isFinite(result)) {
                    return NaN;
                }

                return result;

            } catch (error) {

                return NaN;
            }
        }


        /* =================================================
           HANDLE NUMBER / VALUE
        ================================================= */

        function enterValue(value) {

            if (justCalculated) {

                if (
                    /^[0-9.]$/.test(value) ||
                    value === "π"
                ) {
                    expression = "";
                }

                justCalculated = false;
            }

            expression += value;

            updateCalculatorDisplay();
        }


        /* =================================================
           DELETE
        ================================================= */

        function deleteLast() {

            if (justCalculated) {

                expression = "";
                answer = 0;
                justCalculated = false;

                updateCalculatorDisplay();

                return;
            }

            expression =
                expression.slice(0, -1);

            updateCalculatorDisplay();
        }


        /* =================================================
           CLEAR
        ================================================= */

        function clearCalculator() {

            expression = "";
            answer = 0;
            justCalculated = false;

            updateCalculatorDisplay();
        }


        /* =================================================
           EQUALS
        ================================================= */

        function calculate() {

            if (!expression) {
                return;
            }

            const result =
                calculateExpression(expression);

            if (Number.isFinite(result)) {

                answer =
                    formatCalculatorNumber(result);

                expression =
                    formatCalculatorNumber(result);

            } else {

                answer = "Error";
            }

            justCalculated = true;

            updateCalculatorDisplay();
        }


        /* =================================================
           SCIENTIFIC FUNCTIONS
        ================================================= */

        function runFunction(action) {

            let value;

            if (justCalculated) {

                value = Number(answer);

            } else {

                value =
                    calculateExpression(expression);
            }

            if (!Number.isFinite(value)) {

                answer = "Error";
                updateCalculatorDisplay();

                return;
            }


            let result;


            switch (action) {

                case "sin":

                    result = sin(value);

                    break;


                case "cos":

                    result = cos(value);

                    break;


                case "tan":

                    result = tan(value);

                    break;


                case "log":

                    result =
                        Math.log10(value);

                    break;


                case "ln":

                    result =
                        Math.log(value);

                    break;


                case "sqrt":

    expression += "√(";
    justCalculated = false;

    updateCalculatorDisplay();

    return;


                case "square":

    expression += "^2";
    justCalculated = false;

    updateCalculatorDisplay();

    return;


                case "reciprocal":

                    result =
                        1 / value;

                    break;


                default:

                    return;
            }


            if (!Number.isFinite(result)) {

                answer = "Error";

            } else {

                answer =
                    formatCalculatorNumber(result);

                expression =
                    formatCalculatorNumber(result);

                justCalculated = true;
            }

            updateCalculatorDisplay();
        }


        /* =================================================
           BUTTON HANDLING
        ================================================= */

        calculator
            .querySelectorAll(".calculator-button")
            .forEach(button => {

                button.addEventListener("click", function () {

                    const action =
                        this.dataset.action;

                    const value =
                        this.dataset.value;


                    /* -------------------------------
                       NUMBER / OPERATOR / SYMBOL
                    -------------------------------- */

                    if (value !== undefined) {

                        enterValue(value);

                        return;
                    }


                    /* -------------------------------
                       CLEAR
                    -------------------------------- */

                    if (action === "clear") {

                        clearCalculator();

                        return;
                    }


                    /* -------------------------------
                       DELETE
                    -------------------------------- */

                    if (action === "delete") {

                        deleteLast();

                        return;
                    }


                    /* -------------------------------
                       EQUALS
                    -------------------------------- */

                    if (action === "equals") {

                        calculate();

                        return;
                    }


                    /* -------------------------------
                       SCIENTIFIC FUNCTION
                    -------------------------------- */

                    if (
                        action === "sin" ||
                        action === "cos" ||
                        action === "tan" ||
                        action === "log" ||
                        action === "ln" ||
                        action === "sqrt" ||
                        action === "square" ||
                        action === "reciprocal"
                    ) {

                        runFunction(action);

                        return;
                    }


                    /* -------------------------------
                       SECOND FUNCTION
                    -------------------------------- */

                    if (action === "second") {

                        secondFunction =
                            !secondFunction;

                        this.classList.toggle(
                            "active",
                            secondFunction
                        );

                        return;
                    }


                    /* -------------------------------
                       MODE
                    -------------------------------- */

                    if (action === "mode") {

                        degreeMode =
                            !degreeMode;

                        updateCalculatorDisplay();

                        return;
                    }


                    /* -------------------------------
                       PI
                    -------------------------------- */

                    if (action === "pi") {

                        enterValue("π");

                        return;
                    }


                    /* -------------------------------
                       ANSWER
                    -------------------------------- */

                    if (action === "answer") {

                        enterValue(
                            String(answer)
                        );

                        return;
                    }


                    /* -------------------------------
                       MEMORY CLEAR
                    -------------------------------- */

                    if (action === "memory-clear") {

                        memory = 0;

                        return;
                    }


                    /* -------------------------------
                       MEMORY RECALL
                    -------------------------------- */

                    if (action === "memory-recall") {

                        enterValue(
                            String(memory)
                        );

                        return;
                    }


                    /* -------------------------------
                       SCIENTIFIC NOTATION
                    -------------------------------- */

                    if (action === "scientific") {

                        if (Number.isFinite(Number(answer))) {

                            answer =
                                Number(answer)
                                    .toExponential(6);

                            expression =
                                answer;

                            justCalculated = true;

                            updateCalculatorDisplay();
                        }

                        return;
                    }

                });
            });


        /* =================================================
           KEYBOARD INPUT
        ================================================= */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    !calculator.matches(":hover") &&
                    document.activeElement !== calculator
                ) {
                    return;
                }


                const key = event.key;


                if (/^[0-9]$/.test(key)) {

                    enterValue(key);

                    event.preventDefault();

                    return;
                }


                if (
                    key === "+" ||
                    key === "-" ||
                    key === "*" ||
                    key === "/" ||
                    key === "(" ||
                    key === ")"
                ) {

                    enterValue(key);

                    event.preventDefault();

                    return;
                }


                if (key === ".") {

                    enterValue(".");

                    event.preventDefault();

                    return;
                }


                if (key === "Enter" || key === "=") {

                    calculate();

                    event.preventDefault();

                    return;
                }


                if (key === "Backspace") {

                    deleteLast();

                    event.preventDefault();

                    return;
                }


                if (key === "Escape") {

                    clearCalculator();

                    event.preventDefault();

                    return;
                }

            }
        );


        /* =================================================
           INITIAL DISPLAY
        ================================================= */

        updateCalculatorDisplay();

    }

});