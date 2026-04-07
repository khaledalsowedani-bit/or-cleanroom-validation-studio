const validationDevices = [
  {
    name: "SOLAIR 3100",
    purpose: "Particle counting for cleanroom and OR classification measurements.",
    test: "ISO 14644 particle concentration assessment"
  },
  {
    name: "Testo 400",
    purpose: "Air velocity, turbulence intensity, and environmental parameter measurements.",
    test: "Airflow velocity / TI / temperature / RH"
  },
  {
    name: "Differential Pressure Meter",
    purpose: "Pressure cascade verification between rooms and adjacent spaces.",
    test: "Room pressure validation"
  },
  {
    name: "Aerosol Generator",
    purpose: "PAO aerosol challenge generation for airflow visualization and HEPA leak testing.",
    test: "Visualization / Filter integrity"
  },
  {
    name: "Photometer",
    purpose: "Detection of aerosol penetration during HEPA filter leakage testing.",
    test: "HEPA leak scan"
  },
  {
    name: "Temperature & RH Meter",
    purpose: "Monitoring thermal and humidity stability in critical zones.",
    test: "Environmental qualification"
  }
];

const standardsReference = [
  {
    title: "ISO 14644-1",
    desc: "Defines airborne particle cleanliness classes for cleanrooms and clean zones."
  },
  {
    title: "ISO 14644-3",
    desc: "Specifies test methods including airflow, differential pressure, and recovery."
  },
  {
    title: "DIN 1946-4",
    desc: "Provides ventilation and room requirements for healthcare and operating rooms."
  },
  {
    title: "ASHRAE 170",
    desc: "Ventilation standard for healthcare facilities, including air change and pressure logic."
  },
  {
    title: "EN 1822 / ISO 29463",
    desc: "Classification and performance evaluation of HEPA and ULPA filters."
  },
  {
    title: "GMP / Annex 1",
    desc: "Environmental control principles for critical clean manufacturing areas."
  }
];
