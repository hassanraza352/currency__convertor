let box = document.querySelector('.card');

let countriesData = [];
let currencyMap = {}; // ✅ FIX: maps cca2 (country code) → currency code (e.g. "PK" → "PKR")

let html = `
<div class="block">
    <div class="lbl">From</div>
    <div class="row">
        <div class="flag-box">
            <img src="https://flagcdn.com/w80/pk.png" id="fromFlag">
        </div>

        <select id="countrySelect"></select>

        <input class="amt" type="number" id="fromAmt" value="100">
    </div>
</div>

<div class="mid">
    <div class="line"></div>
    <div class="arrow">↓</div>
    <div class="line"></div>
</div>

<div class="block">
    <div class="lbl">To</div>
    <div class="row">
        <div class="flag-box">
            <img src="https://flagcdn.com/w80/us.png" id="toFlag">
        </div>

        <select id="toCurrency"></select>
       
    </div>
   
</div>
<div  class="block" id="answer">

</div>


<button class="btn" id="convertBtn">Convert Now →</button>
`;

box.innerHTML = html;

async function loadCountries() {

    // ✅ FIX: also fetch "currencies" field so we get currency codes (PKR, USD, etc.)
    let res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,currencies");
    countriesData = await res.json();


    let fromSelect = document.getElementById("countrySelect");
    let toSelect = document.getElementById("toCurrency");

    countriesData.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
    );

    countriesData.forEach((country) => {

        // ✅ FIX: build the map — country code → currency code
        let currencyCode = Object.keys(country.currencies)[0];
        currencyMap[country.cca2] = currencyCode;

        let option1 = document.createElement("option");
        option1.value = country.cca2;
        option1.textContent = country.name.common;

        let option2 = option1.cloneNode(true);

        fromSelect.appendChild(option1);
        toSelect.appendChild(option2);

    });

    // default Pakistan + US
    fromSelect.value = "PK";
    toSelect.value = "US";

}

loadCountries();

document.getElementById("countrySelect").addEventListener("change", function () {

    let code = this.value.toLowerCase();

    document.getElementById("fromFlag").src =
        `https://flagcdn.com/w80/${code}.png`;

});

document.getElementById("toCurrency").addEventListener("change", function () {

    let code = this.value.toLowerCase();

    document.getElementById("toFlag").src =
        `https://flagcdn.com/w80/${code}.png`;

});

async function convertCurrency() {

    let fromCountry = document.getElementById("countrySelect").value;
    let toCountry = document.getElementById("toCurrency").value;
    let amount = parseFloat(document.getElementById("fromAmt").value);

    // ✅ FIX: validate amount
    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    // ✅ FIX: use currency codes (PKR, USD) — not country codes (PK, US)
    let from = currencyMap[fromCountry];
    let to = currencyMap[toCountry];

    try {

        let res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        let data = await res.json();

        let rate = data.rates[to];

        if (!rate) {
            alert("Conversion rate not available for this pair.");
            return;
        }

          let result = amount * rate;
document.getElementById("answer").innerHTML=result;

    } catch (error) {
        console.log("Error:", error);
        alert("Something went wrong. Please try again.");
    }

}


document.getElementById("convertBtn")
    .addEventListener("click", convertCurrency);
    