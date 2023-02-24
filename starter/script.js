// Variables
var searchInput = $("#search-input");
var searchBtn = $(`#search-button`);
var fiveDayForecast = $(`#forecast`);
var todayForecast = $(`#today`);

// API Information
var apiKey = "6a5e21ce19fc0952eac333669721b7de";

// ------------------------------------------- //
searchBtn.on("click", function (event) {
	event.preventDefault();
	var city = searchInput.val();
	weatherLoad(city);
	alert(city);
});

function weatherLoad(city) {
	var query = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
	alert(query);

	if (city != "") {
		$.ajax({
			url: query,
			method: "GET",
		}).then(function (response) {
			var cityInfo = {};
			cityInfo.name = response.name;
			cityInfo.lat = response.lat;
			cityInfo.lon = response.lon;

			//Load up the individual city
			todaysWeatherReport(response);
			fiveDayWeatherReport(response);
		});
	}
}

function todaysWeatherReport(response) {
	const fullDate = moment.unix(response.dt).format("DD/MM/YYYY");
	const image = response.weather[0].icon;

	// Create elements for current weather conditions
	const cityTitleElement = $("<h3>").text(response.name);
	const dateElement = $('<span class="todays-date">').text(" (" + fullDate + ")");
	const iconElement = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + image + ".png");
	const tempElement = $("<p>").text(`Temp: ${response.main.temp} °C`);
	const windElement = $("<p>").text(`Wind: ${response.wind.speed} KPH`);
	const humidElement = $("<p>").text(`Humidity: ${response.main.humidity}%`);

	// Appending time!!
	cityTitleElement.append(dateElement, iconElement);
	todayForecast.empty().append(cityTitleElement, tempElement, windElement, humidElement);
}
