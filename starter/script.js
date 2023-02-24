// Variables
var searchInput = $("#search-input");
var searchBtn = $(`#search-button`);
var fiveDayForecast = $(`#forecast`);
var todayForecast = $(`#today`);

// API Information
var apiKey = "6a5e21ce19fc0952eac333669721b7de";

//Resets

// ------------------------------------------- //
searchBtn.on("click", function (event) {
	event.preventDefault();
	var city = searchInput.val();
	weatherLoad(city);
});

function weatherLoad(city) {
	var query = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";

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
			weatherReport(response, 1);
			todayForecast.removeClass(`hideBox`);
			weatherReport(response, 2);
		});
	}
}

function weatherReport(response, option) {
	if (option === 1) {
		const fullDate = moment.unix(response.dt).format("DD/MM/YYYY");
		const image = response.weather[0].icon;

		// Creating the elements to add to the #today div
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
	if (option === 2) {
		// Location elements
		var latitude = response.coord.lat;
		var longitude = response.coord.lon;
		var query = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey + "&units=metric";

		$.ajax({
			url: query,
			method: "GET",
		}).then(function (response) {
			var fiveForecastList = response.list;
			var dateToday = moment().format("DD/MM/YYYY");
			var row = $(`<div>`).addClass(`row`);
			var fiveDayForecastTitle = $(`<h4>`).text("5-Day Forecast:");
			fiveDayForecast.append(fiveDayForecastTitle);

			// Creating the cards for each day
			for (let index = 0; index < fiveForecastList.length; index++) {
				var weatherImage = fiveForecastList[index].weather[0].icon;
				var weatherDate = moment.unix(fiveForecastList[index].dt).format("DD/MM/YYYY");
				// If the day found is not today's date
				if (weatherDate !== dateToday) {
					var card = $(`<div>`).addClass(`card`);
					var cardBody = $(`<div>`).addClass(`card-body`);
					var h5 = $(`<div>`).addClass(`card-title`).text(dateToday);
				}
			}
		});
	}
}
