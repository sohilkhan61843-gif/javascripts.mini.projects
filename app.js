const BASE_URL =
  "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Add currency options in dropdown
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");

    newOption.innerText = currCode;
    newOption.value = currCode;

    // Default selected currencies
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } 
    else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.appendChild(newOption);
  }

  // Change flag when currency changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  // Check empty or invalid amount
  if (amtVal === "" || amtVal <= 0) {
    amtVal = 1;
    amount.value = "1";
  }

  // API URL
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  try {
    // Fetch data
    let response = await fetch(URL);

    // Convert response to JSON
    let data = await response.json();

    // Get exchange rate
    let rate =
      data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

    // Final converted amount
    let finalAmount = amtVal * rate;

    // Show result
    msg.innerText =
      `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

  } catch (error) {
    msg.innerText = "Something went wrong!";
    console.log(error);
  }
};

// Update country flag
const updateFlag = (element) => {
  let currCode = element.value;

  let countryCode = countryList[currCode];

  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  let img = element.parentElement.querySelector("img");

  img.src = newSrc;
};

// Button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Run when page loads
window.addEventListener("load", () => {
  updateExchangeRate();
});
