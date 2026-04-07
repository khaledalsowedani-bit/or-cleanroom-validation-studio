const navButtons = document.querySelectorAll(".nav-btn");
const pages = document.querySelectorAll(".page");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.page).classList.add("active");
  });
});

const deviceGrid = document.getElementById("deviceGrid");
const standardsGrid = document.getElementById("standardsGrid");

function renderDevices() {
  validationDevices.forEach(device => {
    const card = document.createElement("div");
    card.className = "device-card";
    card.innerHTML = `
      <h3>${device.name}</h3>
      <p><strong>Purpose:</strong> ${device.purpose}</p>
      <p><strong>Primary Test:</strong> ${device.test}</p>
    `;
    deviceGrid.appendChild(card);
  });
}

function renderStandards() {
  standardsReference.forEach(std => {
    const card = document.createElement("div");
    card.className = "standard-card";
    card.innerHTML = `
      <h3>${std.title}</h3>
      <p>${std.desc}</p>
    `;
    standardsGrid.appendChild(card);
  });
}

renderDevices();
renderStandards();

const analyzeBtn = document.getElementById("analyzeBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");

const statusBox = document.getElementById("statusBox");
const criteriaList = document.getElementById("criteriaList");
const reportOutput = document.getElementById("reportOutput");

analyzeBtn.addEventListener("click", runAnalysis);
resetBtn.addEventListener("click", resetInputs);
downloadBtn.addEventListener("click", downloadReport);

function runAnalysis() {
  const roomName = document.getElementById("roomName").value || "OR-01";
  const roomType = document.getElementById("roomType").value;
  const targetClass = document.getElementById("targetClass").value;
  const ltfSize = document.getElementById("ltfSize").value || "Undefined";

  const airVelocity = parseFloat(document.getElementById("airVelocity").value) || 0;
  const diffPressure = parseFloat(document.getElementById("diffPressure").value) || 0;
  const temperature = parseFloat(document.getElementById("temperature").value) || 0;
  const humidity = parseFloat(document.getElementById("humidity").value) || 0;
  const particle05 = parseFloat(document.getElementById("particle05").value) || 0;
  const particle5 = parseFloat(document.getElementById("particle5").value) || 0;
  const ach = parseFloat(document.getElementById("ach").value) || 0;
  const ti = parseFloat(document.getElementById("ti").value) || 0;
  const notes = document.getElementById("notes").value || "No engineering notes entered.";

  let p05Limit = 352000;
  let p5Limit = 2930;

  if (targetClass === "ISO 8") {
    p05Limit = 3520000;
    p5Limit = 29300;
  }

  let checks = [];
  let pass = 0;
  let warn = 0;
  let fail = 0;

  if (airVelocity >= 0.22 && airVelocity <= 0.30) {
    checks.push("Air velocity is within the preferred unidirectional airflow range.");
    pass++;
  } else if ((airVelocity >= 0.18 && airVelocity < 0.22) || (airVelocity > 0.30 && airVelocity <= 0.35)) {
    checks.push("Air velocity is near the engineering limit and should be reviewed.");
    warn++;
  } else {
    checks.push("Air velocity is outside the acceptable engineering range.");
    fail++;
  }

  if (diffPressure >= 10) {
    checks.push("Differential pressure is acceptable.");
    pass++;
  } else if (diffPressure >= 5) {
    checks.push("Differential pressure is marginal.");
    warn++;
  } else {
    checks.push("Differential pressure is insufficient.");
    fail++;
  }

  if (temperature >= 18 && temperature <= 22) {
    checks.push("Temperature is within preferred OR range.");
    pass++;
  } else if (temperature >= 17 && temperature <= 24) {
    checks.push("Temperature is slightly outside preferred range.");
    warn++;
  } else {
    checks.push("Temperature is outside recommended range.");
    fail++;
  }

  if (humidity >= 40 && humidity <= 60) {
    checks.push("Relative humidity is acceptable.");
    pass++;
  } else if (humidity >= 30 && humidity <= 65) {
    checks.push("Relative humidity is borderline.");
    warn++;
  } else {
    checks.push("Relative humidity is outside acceptable range.");
    fail++;
  }

  if (particle05 <= p05Limit) {
    checks.push(`Particle count ≥0.5 µm complies with ${targetClass}.`);
    pass++;
  } else {
    checks.push(`Particle count ≥0.5 µm exceeds ${targetClass} limit.`);
    fail++;
  }

  if (particle5 <= p5Limit) {
    checks.push(`Particle count ≥5.0 µm complies with ${targetClass}.`);
    pass++;
  } else {
    checks.push(`Particle count ≥5.0 µm exceeds ${targetClass} limit.`);
    fail++;
  }

  if (ach >= 20) {
    checks.push("Air changes per hour are acceptable for critical space baseline.");
    pass++;
  } else if (ach >= 15) {
    checks.push("Air changes per hour are borderline.");
    warn++;
  } else {
    checks.push("Air changes per hour are insufficient.");
    fail++;
  }

  if (targetClass === "DIN Class Ia") {
    if (ti <= 20) {
      checks.push("Turbulence intensity is acceptable for DIN Class Ia target.");
      pass++;
    } else if (ti <= 25) {
      checks.push("Turbulence intensity is near acceptance threshold.");
      warn++;
    } else {
      checks.push("Turbulence intensity exceeds DIN Class Ia target.");
      fail++;
    }
  } else {
    if (ti <= 30) {
      checks.push("Turbulence intensity is acceptable.");
      pass++;
    } else {
      checks.push("Turbulence intensity requires review.");
      warn++;
    }
  }

  let status = "PASS";
  let statusClass = "pass";
  let ticker = "Stable validation result • Airflow pattern acceptable • Engineering review complete •";

  if (fail >= 2) {
    status = "FAIL";
    statusClass = "fail";
    ticker = "Critical non-conformity detected • Review HVAC balancing, filtration, airflow and room pressure •";
  } else if (fail === 1 || warn >= 2) {
    status = "WARNING";
    statusClass = "warn";
    ticker = "Some parameters are borderline • Further engineering investigation recommended •";
  }

  statusBox.className = `status-box ${statusClass}`;
  statusBox.textContent = `Overall Validation Status: ${status}`;
  document.getElementById("liveTicker").textContent = ticker;

  criteriaList.innerHTML = "";
  checks.forEach(item => {
    const el = document.createElement("div");
    el.className = "criteria-item";
    el.textContent = item;
    criteriaList.appendChild(el);
  });

  document.getElementById("currentRoomName").textContent = roomName;
  document.getElementById("currentClass").textContent = targetClass;
  document.getElementById("overallStatus").textContent = status;
  document.getElementById("sumVelocity").textContent = airVelocity.toFixed(2) + " m/s";
  document.getElementById("sumDP").textContent = diffPressure.toFixed(1) + " Pa";
  document.getElementById("sumTemp").textContent = temperature.toFixed(1) + " °C";
  document.getElementById("sumRH").textContent = humidity.toFixed(1) + " %";

  const report = `
OR & CLEANROOM VALIDATION REPORT
========================================
Project: Kartal OR Validation
Room Name: ${roomName}
Room Type: ${roomType}
Target Class: ${targetClass}
LTF Size: ${ltfSize}

MEASURED VALUES
----------------------------------------
Average Air Velocity: ${airVelocity} m/s
Differential Pressure: ${diffPressure} Pa
Temperature: ${temperature} °C
Relative Humidity: ${humidity} %
Particle Count ≥0.5 µm: ${particle05} particles/m³
Particle Count ≥5.0 µm: ${particle5} particles/m³
ACH: ${ach}
Turbulence Intensity: ${ti} %

ENGINEERING EVALUATION
----------------------------------------
${checks.map((item, i) => `${i + 1}. ${item}`).join("\n")}

DEVICES RELEVANT TO THIS VALIDATION
----------------------------------------
- SOLAIR 3100
- Testo 400
- Differential Pressure Meter
- Aerosol Generator
- Photometer

ENGINEER NOTES
----------------------------------------
${notes}

OVERALL STATUS
----------------------------------------
${status}

DISCLAIMER
----------------------------------------
This software output is intended as an engineering decision-support layer for portfolio and technical demonstration purposes.
Final field acceptance must be based on approved protocols, calibrated instruments, applicable standards, room use state,
and final authorized engineering review.
  `.trim();

  reportOutput.textContent = report;
}

function resetInputs() {
  ["airVelocity","diffPressure","temperature","humidity","particle05","particle5","ach","ti","notes"].forEach(id => {
    document.getElementById(id).value = "";
  });

  statusBox.className = "status-box neutral";
  statusBox.textContent = "Awaiting analysis...";
  criteriaList.innerHTML = "";
  reportOutput.textContent = "No report generated yet.";
  document.getElementById("liveTicker").textContent =
    "Validation engine loaded • Airflow monitoring ready • Device library synced • Awaiting engineering input •";

  document.getElementById("sumVelocity").textContent = "0.00 m/s";
  document.getElementById("sumDP").textContent = "0.0 Pa";
  document.getElementById("sumTemp").textContent = "0.0 °C";
  document.getElementById("sumRH").textContent = "0.0 %";
  document.getElementById("overallStatus").textContent = "READY";
}

function downloadReport() {
  const content = reportOutput.textContent;
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "or_cleanroom_validation_report.txt";
  link.click();
}
