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
			`https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${apiKey}`
		);
		if (!response.ok) {
			console.log("Error");
		} else {
			const data = await response.json();
			return data.list;
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

form.addEventListener("submit", async (e) => {
	e.preventDefault();
	const input = document.querySelector(".input-control").value;
	weatherData = await getWeatherData(input);
	forecastData = await getForecastData(input);
	renderWeather();
	document.querySelector(".input-control").value = "";
});
