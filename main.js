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
			console.log(data.list);
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
	const template = `<h2>${weatherData.name}</h2><img src=https://openweathermap.org/img/wn/${weatherData.weather.icon}@2x.png><p>${weatherData.temp}</p><p>${weatherData.weather.description}</p>`;
	weatherDiv.innerHTML = template;
};

function renderForecast() {
	const forecastsDiv = document.querySelector(".forecast-container");
	forecastsDiv.replaceChildren();

	forecastData.forEach((forecast) => {
		const forecastDiv = document.createElement("div");
		const dateP = document.createElement("p");
		const weatherImg = document.createElement("img");
		const tempP = document.createElement("p");
		const weatherP = document.createElement("p");

		weatherImg.setAttribute(
			"src",
			`https://openweathermap.org/img/wn/${forecast.weather.icon}@2x.png`
		);

		dateP.textContent = `${forecast.day}`;
		tempP.textContent = `${forecast.temp}`;
		weatherP.textContent = `${forecast.weather.description}`;

		forecastDiv.appendChild(dateP);
		forecastDiv.appendChild(weatherImg);
		forecastDiv.appendChild(tempP);
		forecastDiv.appendChild(weatherP);

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
