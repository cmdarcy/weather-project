// Global Variables
// ===================================
const form = document.getElementsByTagName("form")[0];
const inputField = document.querySelector(".input-control");
const apiKey = `c8d0a8706ef69da2623e093b018f765f`;
let weatherData;
let forecastData;

/**
 * Fetches weather data for a given city
 * @param {string} query - The city name to search for
 * @returns {Promise<Object>} Weather data object or error object
 */
const getWeatherData = async (query) => {
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=imperial`
		);
		if (!response.ok) {
			throw new Error(
				`Failed to find city: ${query} (Status: ${response.status})`
			);
		} else {
			const data = await response.json();
			return {
				name: data.name,
				temp: data.main.temp,
				weather: data.weather[0],
			};
		}
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
};

/**
 * Fetches forecast data for a given city
 * @param {string} query - The city name to search for
 * @returns {Promise<Object>} Weather data object or error object
 */
const getForecastData = async (query) => {
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=imperial`
		);
		if (!response.ok) {
			throw new Error(
				`Failed to find city: ${query} (Status: ${response.status})`
			);
		} else {
			const data = await response.json();
			//reduces data array to 5-day forecast by taking every 8th forecast
			const compiledForecast = data.list.reduce((acc, curr, index) => {
				if (index % 8 === 0) {
					acc.push({
						day: new Date(curr.dt_txt).toLocaleDateString("en-US", {
							weekday: "long",
						}),
						temp: curr.main.temp,
						weather: curr.weather[0],
					});
					return acc;
				} else {
					return acc;
				}
			}, []);
			return compiledForecast;
		}
	} catch (error) {
		console.error(error);
		return { error: error.message };
	}
};

/**
 * Renders the current weather data to the DOM
 * Creates a card displaying city name, weather icon, temperature, and description
 * Also creates a "Set City as Default" button if it doesn't exist
 * @returns {void}
 */
const renderWeather = () => {
	const weatherDiv = document.querySelector(".weather-container");
	weatherDiv.replaceChildren();
	weatherDiv.classList.add("d-flex", "justify-content-center", "mt-4");

	const card = document.createElement("div");
	card.classList.add("card", "text-center", "col-12", "col-md-4", "p-0");

	const cardBody = document.createElement("div");
	cardBody.classList.add("card-body");

	const cityName = document.createElement("h2");
	cityName.classList.add("card-title", "mb-3");
	cityName.textContent = weatherData.name;

	const weatherImg = document.createElement("img");
	weatherImg.setAttribute(
		"src",
		`https://openweathermap.org/img/wn/${weatherData.weather.icon}@2x.png`
	);
	weatherImg.classList.add("card-img");

	const tempP = document.createElement("p");
	tempP.classList.add("card-text", "fs-2", "fw-bold", "mb-2");
	tempP.textContent = `${weatherData.temp}°F`;

	const weatherP = document.createElement("p");
	weatherP.classList.add("card-text", "text-muted");
	weatherP.textContent = weatherData.weather.description;

	cardBody.appendChild(cityName);
	cardBody.appendChild(weatherImg);
	cardBody.appendChild(tempP);
	cardBody.appendChild(weatherP);

	card.appendChild(cardBody);
	weatherDiv.appendChild(card);

	if (!document.querySelector(".btn-secondary")) {
		const defaultBtn = document.createElement("button");
		defaultBtn.classList.add("btn", "btn-secondary");
		defaultBtn.setAttribute("type", "button");
		defaultBtn.innerText = "Set City as Default";

		defaultBtn.addEventListener("click", () => {
			localStorage.setItem("weatherData", JSON.stringify(weatherData));
			localStorage.setItem("forecastData", JSON.stringify(forecastData));
		});
		form.appendChild(defaultBtn);
	}
};

/**
 * Renders the 5-day forecast data to the DOM
 * Creates a list of cards displaying day of week, weather icon, temperature, and description
 * Each card represents one day's forecast
 * @returns {void}
 */
function renderForecast() {
	const forecastsDiv = document.querySelector(".forecast-container");
	forecastsDiv.replaceChildren();
	forecastsDiv.classList.add("row", "gap-3", "justify-content-center", "mt-4");

	forecastData.forEach((forecast) => {
		const forecastDiv = document.createElement("div");
		forecastDiv.classList.add(
			"card",
			"col-12",
			"col-md-2",
			"text-center",
			"p-0"
		);

		const cardBody = document.createElement("div");
		cardBody.classList.add("card-body");

		const dateP = document.createElement("p");
		dateP.classList.add("card-title", "fw-bold");

		const weatherImg = document.createElement("img");
		weatherImg.classList.add("card-img");

		const tempP = document.createElement("p");
		tempP.classList.add("card-text", "fs-4");

		const weatherP = document.createElement("p");
		weatherP.classList.add("card-text", "text-muted");

		weatherImg.setAttribute(
			"src",
			`https://openweathermap.org/img/wn/${forecast.weather.icon}@2x.png`
		);

		dateP.textContent = `${forecast.day}`;
		tempP.textContent = `${forecast.temp}°F`;
		weatherP.textContent = `${forecast.weather.description}`;

		cardBody.appendChild(dateP);
		cardBody.appendChild(weatherImg);
		cardBody.appendChild(tempP);
		cardBody.appendChild(weatherP);

		forecastDiv.appendChild(cardBody);
		forecastsDiv.appendChild(forecastDiv);
	});
}

form.addEventListener("submit", async (e) => {
	e.preventDefault();
	weatherData = await getWeatherData(inputField.value);
	forecastData = await getForecastData(inputField.value);

	//checks if data fetching returned an error, if so alert user and highlight input
	if (weatherData.error || forecastData.error) {
		alert(`Could not fetch weather data on this city, please try another one!`);
		inputField.classList.add("is-invalid");
		inputField.focus();
		return;
	}
	renderWeather();
	renderForecast();
	inputField.value = "";
});

//removes invalid class from input upon change
inputField.addEventListener("input", () => {
	inputField.classList.remove("is-invalid");
});

//on DOM load checks if local storage contains default city weather info, if so renders it
document.addEventListener("DOMContentLoaded", () => {
	if (
		localStorage.getItem("weatherData") &&
		localStorage.getItem("forecastData")
	) {
		weatherData = JSON.parse(localStorage.getItem("weatherData"));
		forecastData = JSON.parse(localStorage.getItem("forecastData"));
		renderWeather();
		renderForecast();
	}
});
