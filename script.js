let angleMode = "deg";
let display = document.getElementById("display");
let displayText = document.getElementById("display-text");
let answerDisplay = document.getElementById("answer-display");
let ans = 0;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('input[name="angle"]').forEach((radio) => {
    radio.addEventListener("change", () => (angleMode = radio.value));
  });

  document.querySelectorAll("button[data-val]").forEach((btn) => {
    btn.addEventListener("click", () => append(btn.dataset.val));
  });

  document.getElementById("clear").addEventListener("click", clearDisplay);
  document.getElementById("equals").addEventListener("click", calculate);
});

// ✅ Ans Button - Show "Ans" but act as numeric result
document.getElementById("ans-key").addEventListener("click", () => {
  displayText.innerText = "Ans"; // display "Ans"
  updateAnswerDisplay();         // evaluate it as numeric value
});

function append(value) {
  if (displayText.innerText === "0") {
    displayText.innerText = value;
  } 
  // ✅ Keep "Ans" when adding operators after pressing Ans
  else if (displayText.innerText === "Ans" && /[+\-*/^]/.test(value)) {
    displayText.innerText = "Ans" + value;
  } 
  // ✅ If current is Ans and next is a number, replace Ans
  else if (displayText.innerText === "Ans" && /[0-9]/.test(value)) {
    displayText.innerText = value;
  } 
  else {
    displayText.innerText += value;
  }
  updateAnswerDisplay();
}


function clearDisplay() {
  displayText.innerText = "0";
  answerDisplay.innerText = "= 0";
}

function deleteChar() {
  const funcPatterns = [
    "asin(", "acos(", "atan(",
    "sin(", "cos(", "tan(",
    "sqrt(", "cbrt(", "ln(", "log(",
    "Ans", "EXP", "pi", "e"
  ];

  let current = displayText.innerText;

  for (let func of funcPatterns) {
    if (current.endsWith(func)) {
      displayText.innerText = current.slice(0, -func.length);
      updateAnswerDisplay();
      return;
    }
  }

  if (current.length <= 1) {
    displayText.innerText = "0";
  } else {
    displayText.innerText = current.slice(0, -1);
  }

  updateAnswerDisplay();
}

function calculate() {
  try {
    let expr = displayText.innerText;

    expr = expr.replace(/pi/g, "Math.PI")
               .replace(/e/g, "Math.E")
               .replace(/Ans/g, ans)
               .replace(/±/g, "-")
               .replace(/EXP/g, "e")
               .replace(/\^/g, "**")
               .replace(/(\d+)!/g, (_, n) => `factorial(${n})`)
               .replace(/(\d+(\.\d+)?)%/g, (_, num) => `(${num}/100)`);

    if (angleMode === "deg") {
      expr = expr.replace(/sin\(([^)]+)\)/g, (_, arg) => `Math.sin(degToRad(${arg}))`)
                 .replace(/cos\(([^)]+)\)/g, (_, arg) => `Math.cos(degToRad(${arg}))`)
                 .replace(/tan\(([^)]+)\)/g, (_, arg) => `Math.tan(degToRad(${arg}))`)
                 .replace(/asin\(([^)]+)\)/g, (_, arg) => `radToDeg(Math.asin(${arg}))`)
                 .replace(/acos\(([^)]+)\)/g, (_, arg) => `radToDeg(Math.acos(${arg}))`)
                 .replace(/atan\(([^)]+)\)/g, (_, arg) => `radToDeg(Math.atan(${arg}))`);
    } else {
      expr = expr.replace(/sin\(/g, "Math.sin(")
                 .replace(/cos\(/g, "Math.cos(")
                 .replace(/tan\(/g, "Math.tan(")
                 .replace(/asin\(/g, "Math.asin(")
                 .replace(/acos\(/g, "Math.acos(")
                 .replace(/atan\(/g, "Math.atan(");
    }

    expr = expr.replace(/sqrt\(/g, "Math.sqrt(")
               .replace(/log\(/g, "Math.log10(")
               .replace(/ln\(/g, "Math.log(")
               .replace(/cbrt\(/g, "Math.cbrt(");

    const result = Function('"use strict"; return (' + expr + ')')();
    displayText.innerText = result;
    ans = result;
    answerDisplay.innerText = "= " + result;
  } catch {
    displayText.innerText = "Error";
    answerDisplay.innerText = "";
  }
}

document.getElementById("RND").addEventListener("click", () => {
  try {
    let val = eval(displayText.innerText);
    displayText.innerText = Math.round(val);
    updateAnswerDisplay();
  } catch {
    displayText.innerText = "Error";
    answerDisplay.innerText = "";
  }
});

function degToRad(deg) {
  return (parseFloat(deg) * Math.PI) / 180;
}

function radToDeg(rad) {
  return (parseFloat(rad) * 180) / Math.PI;
}

function factorial(n) {
  n = parseInt(n);
  if (n < 0) throw "Invalid input for factorial";
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function updateAnswerDisplay() {
  try {
    let expr = displayText.innerText;

    // Replace display values with JS equivalents
    let evalExpr = expr.replace(/pi/g, "Math.PI")
                       .replace(/e/g, "Math.E")
                       .replace(/Ans/g, ans)
                       .replace(/±/g, "-")
                       .replace(/EXP/g, "e")
                       .replace(/\^/g, "**")
                       .replace(/(\d+)!/g, (_, n) => `factorial(${n})`)
                       .replace(/(\d+(\.\d+)?)%/g, (_, num) => `(${num}/100)`);

    if (angleMode === "deg") {
      evalExpr = evalExpr.replace(/sin\(([^)]+)\)/g, (_, arg) => `Math.sin(degToRad(${arg}))`)
                         .replace(/cos\(([^)]+)\)/g, (_, arg) => `Math.cos(degToRad(${arg}))`)
                         .replace(/tan\(([^)]+)\)/g, (_, arg) => `Math.tan(degToRad(${arg}))`)
                         .replace(/asin\(([^)]+)\)/g, (_, arg) => `radToDeg(Math.asin(${arg}))`)
                         .replace(/acos\(([^)]+)\)/g, (_, arg) => `radToDeg(Math.acos(${arg}))`)
                         .replace(/atan\(([^)]+)\)/g, (_, arg) => `radToDeg(Math.atan(${arg}))`);
    } else {
      evalExpr = evalExpr.replace(/sin\(/g, "Math.sin(")
                         .replace(/cos\(/g, "Math.cos(")
                         .replace(/tan\(/g, "Math.tan(")
                         .replace(/asin\(/g, "Math.asin(")
                         .replace(/acos\(/g, "Math.acos(")
                         .replace(/atan\(/g, "Math.atan(");
    }

    evalExpr = evalExpr.replace(/sqrt\(/g, "Math.sqrt(")
                       .replace(/log\(/g, "Math.log10(")
                       .replace(/ln\(/g, "Math.log(")
                       .replace(/cbrt\(/g, "Math.cbrt(");

    const result = Function('"use strict"; return (' + evalExpr + ')')();

    if (!isNaN(result)) {
      answerDisplay.innerText = "= " + result;
    } else {
      answerDisplay.innerText = "= " + ans; 
    }

  } catch {

    if (displayText.innerText === "Ans" || /^Ans[\+\-\*\/]?$/.test(displayText.innerText)) {
      answerDisplay.innerText = "= " + ans;
    } else {
      answerDisplay.innerText = "";
    }
  }
}

// Keyboard 
document.addEventListener("keydown", (e) => {
  const key = e.key;

  // Numbers and decimal
  if (/^[0-9.]$/.test(key)) {
    append(key);
  }

  // Operators
  else if (key === "+") append("+");
  else if (key === "-") append("-");
  else if (key === "*") append("*");
  else if (key === "/") append("/");

  // Parentheses
  else if (key === "(") append("(");
  else if (key === ")") append(")");

  // Enter or = to calculate
  else if (key === "Enter" || key === "=") {
    calculate();
  }

  // Backspace to delete character
  else if (key === "Backspace") {
    deleteChar();
  }

  // Delete key to clear display
  else if (key === "Delete") {
    clearDisplay();
  }

  // Ans key (mapped to A)
  else if (key.toLowerCase() === "a") {
    displayText.innerText = "Ans";
    updateAnswerDisplay();
  }

  // RND key (mapped to R)
  else if (key.toLowerCase() === "r") {
    document.getElementById("RND").click();
  }

  // Exponential (mapped to E)
  else if (key.toLowerCase() === "e") {
    append("EXP");
  }
});
