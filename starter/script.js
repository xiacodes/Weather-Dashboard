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
	// weatherLoad(city);
	alert(city);
});

// weatherLoad(city) {
//     var query = "https://api.openweathermap.org/data/2.5/weather?q=" + city +
//     "&appid=" +  apiKey + "&units=metric";

//     // if (city == "") {

//     // }
// }
