// Variables
var searchInput = $("#search-input");
var searchBtn = $(`#search-button`);
var fiveDayForecast = $(`#forecast`);
var todayForecast = $(`#today`);
var historyContainer = $(`#history`);

// API Information
var apiKey = "6a5e21ce19fc0952eac333669721b7de";

//Storing cities in an array
var historyCitiesList = [];

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

			//Storing the city name
			storingCity(cityInfo);
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
			var row = $(`<div>`).attr("id", "myCol").addClass(`col`);
			var fiveDayForecastTitle = $(`<h4>`).text("5-Day Forecast:");
			fiveDayForecast.append(fiveDayForecastTitle);

			// Creating the cards for each day
			for (let index = 0; index < fiveForecastList.length; index++) {
				var weatherImage = fiveForecastList[index].weather[0].icon;
				var weatherTime = parseInt(moment.unix(fiveForecastList[index].dt).format("H"));
				var weatherDate = moment.unix(fiveForecastList[index].dt).format("DD/MM/YYYY");

				// If the day found is not today's date
				if (weatherTime == 12 && weatherDate !== dateToday) {
					// Copying card structure from Bootstrap 4.3
					var card = $(`<div>`).addClass(`card`);
					var cardBody = $(`<div>`).addClass(`card-body`);
					var h5 = $(`<div>`).addClass(`card-title`).text(weatherDate);
					var img = $(`<img>`).attr("src", `http://openweathermap.org/img/wn/` + weatherImage + `.png`);

					// Added the weather information
					var cardTextWrapper = $(`<div>`).addClass(`card-text`);
					var temp = $(`<p>`).text(`Temp: ${fiveForecastList[index].main.temp} °C`);
					var wind = $("<p>").text(`Wind: ${fiveForecastList[index].wind.speed} KPH`);
					var humid = $("<p>").text(`Humidity: ${fiveForecastList[index].main.humidity}%`);

					// Adding the <p> elements to the cardTextWrapper
					cardTextWrapper.append(temp, wind, humid);

					//Creating the main card body
					cardBody.append(h5, img, cardTextWrapper);

					//Creating the last card parts
					card.append(cardBody);
					row.append(card);
					fiveDayForecast.empty().append(row);
				}
			}
		});
	}
}
function storingCity(city) {
	// Check if the city name entered has already been saved
	if (cities.some((item) => item.name.toLowerCase() === city.toLowerCase())) {
		// Exit the function early if the city already exists
		return;
	}

	// Add the new city object to the cities array
	historyCitiesList.push(city);

	// Store the updated cities array
	saveCityLocally();

	// Render the updated list of cities to the DOM
	createCityButtons();
}

function saveCityLocally() {
	// Serialize the cities array to a JSON string and store it in LocalStorage
	var serializedCities = JSON.stringify(historyCitiesList);
	alert(serializedCities);
	localStorage.setItem("cities", serializedCities);
}
function createCityButtons() {
	// Retrieve the serialized cities string from LocalStorage and parse it into an array
	var citiesArray = JSON.parse(localStorage.getItem("cities")) || [];

	// Render a new button for each city in the savedCities array
	historyContainer.empty();

	for (var index = 0; index < citiesArray.length; index++) {
		var city = citiesArray[index].name;
		var historyButton = $("<button>").addClass("btn btn-small").attr("id", city.name).text(city);
		historyContainer.prepend(historyButton);
	}
}
