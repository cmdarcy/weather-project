const form = document.getElementsByTagName("form")[0];
const apiKey = `c8d0a8706ef69da2623e093b018f765f`;
let weatherData;
let forecastData;

const getWeatherData = async (query) => {
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=imperial`
		);
		if (!response.ok) {
			console.log("Error");
		} else {
			const data = await response.json();
			return {
				name: data.name,
				temp: data.main.temp,
				weather: data.weather[0],
			};
		}
	} catch (error) {
		console.log(error);
	}
};

const getForecastData = async (query) => {
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}&units=imperial`
		);
		if (!response.ok) {
			console.log("Error");
		} else {
			const data = await response.json();
			const compiledForecast = data.list.reduce((acc, curr, index) => {
				if (index % 8 === 0) {
					acc.push({
						date_info: { dt: curr.dt, dt_txt: curr.dt_txt },
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
		console.log(error);
	}
};

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
};

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
	const input = document.querySelector(".input-control").value;
	weatherData = await getWeatherData(input);
	forecastData = await getForecastData(input);
	renderWeather();
	renderForecast();
	document.querySelector(".input-control").value = "";
});
