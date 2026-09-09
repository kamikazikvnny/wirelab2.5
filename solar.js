
/* =========================================================
   SOLARLAB
   MAIN JAVASCRIPT FILE
========================================================= */


/* =========================================================
   SOLARLAB STARTUP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "SolarLab is ready!"
        );

    }
);


/* =========================================================
   SOLAR CALCULATOR FUNCTIONS
========================================================= */


/* =========================================================
   SOLAR POWER CALCULATION
========================================================= */

/*
    Power = Voltage × Current

    Watts = Volts × Amps
*/

function calculateSolarPower(
    voltage,
    current
) {

    const power =
        voltage * current;

    return power;

}


/*
    Example:

    calculateSolarPower(
        24,
        10
    );

    Result:

    240 Watts
*/


/* =========================================================
   DAILY ENERGY CALCULATION
========================================================= */

/*
    Energy = Power × Time

    Watt Hours = Watts × Hours
*/

function calculateDailyEnergy(
    power,
    hours
) {

    const energy =
        power * hours;

    return energy;

}


/* =========================================================
   SOLAR PANEL ARRAY CALCULATION
========================================================= */

/*
    Number of Panels =

    Required System Watts
    ÷
    Panel Watts
*/

function calculatePanelsNeeded(
    systemWatts,
    panelWatts
) {

    const panels =
        Math.ceil(
            systemWatts /
            panelWatts
        );

    return panels;

}


/* =========================================================
   BATTERY CAPACITY CALCULATION
========================================================= */

/*
    Watt Hours =

    Battery Voltage
    ×
    Amp Hours
*/

function calculateBatteryCapacity(
    voltage,
    ampHours
) {

    const wattHours =
        voltage * ampHours;

    return wattHours;

}


/* =========================================================
   SOLAR POWER CALCULATOR
========================================================= */

const solarPowerButton =
    document.getElementById(
        "calculate-solar-power"
    );


if (solarPowerButton) {

    solarPowerButton.addEventListener(
        "click",
        function () {


            /* GET VOLTAGE */

            const voltage =
                Number(
                    document.getElementById(
                        "solar-voltage"
                    ).value
                );


            /* GET CURRENT */

            const current =
                Number(
                    document.getElementById(
                        "solar-current"
                    ).value
                );


            /* GET RESULT ELEMENT */

            const result =
                document.getElementById(
                    "solar-power-result"
                );


            /* VALIDATION */

            if (
                voltage <= 0 ||
                current <= 0
            ) {

                result.textContent =
                    "Please enter valid values.";

                return;

            }


            /* CALCULATE POWER */

            const power =
                calculateSolarPower(
                    voltage,
                    current
                );


            /* DISPLAY RESULT */

            result.textContent =
                power +
                " Watts";


        }
    );

}


/* =========================================================
   END OF SOLARLAB JAVASCRIPT
========================================================= */

