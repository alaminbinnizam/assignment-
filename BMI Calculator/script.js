
function calculateBMI() {
  //dom selection
  let weightinput = parseFloat(document.getElementById("weightInput").value);
  let heightinput = parseFloat(document.getElementById("heightInput").value) / 100;
  let result = document.getElementById("result");


  let bmi = weightinput / (heightinput * heightinput); //main calculation

  //extra
  if (bmi < 18.5) {
    result.style.color = "blue";
  } else if (bmi < 25) {
    result.style.color = "green";
  } else if (bmi < 30) {
    result.style.color = "orange";
  } else {
    result.style.color = "red";
  }

result.innerHTML = bmi.toFixed(2);

}



