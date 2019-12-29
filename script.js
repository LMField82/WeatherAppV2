var apiKey = "285cabe6ea88703954ecaf1a6437b213";
var prevSearchArr = [];

console.log("here is something");
    $("#searchBtn").on("click", function() {
    
        var searchValue = $("#searchCity").val();
        $("#searchCity").val("");
        searchWeather(searchValue);
        console.log(searchValue);
        
    });   
        
    $(".history").on("click", "li", function() {
        searchWeather($(this).text());

    });

    function makeRow(searchValue) { 
   $(".prevSearch").prepend($("<li>").addClass("list-group-item list-group-item-action").text(searchValue));
        
    }     

//city weather current and future       
        function searchWeather (searchValue) {
           $("#currentWeather").empty();

          var queryURL =  "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&APPID=" + apiKey + "&units=imperial"
           
            $.ajax({
                type: "GET", 
                url: queryURL,
                dataType: "json",
                success: function(data) {
                    
                    //create history link for this search
                    // if (history.indexOf(searchValue) != -1) {
                    //       history.push(searchValue);
                    //       window.localStorage.setItem(".history", JSON.stringify(history));
                    //       makeRow();
                    //       addButton();
                    //     }
                    // $("#searchBtn").on("click", "li", function(data) {
                    //     searchWeather($(this).text());
                    //     function addButton() {
                
                    //     $("<li>").addClass("prevSearch").prepend(searchValue);
                    //     console.log("is this working?")
                    //     $("#currentWeather").empty();
                    //     } 
                
                        
                        
                        
                    // });
                    
                        console.log(queryURL);

                        var title = $("<h1>").addClass("city").text(data.name +"   "+ new Date().toLocaleDateString());
                        var card = $("<div>").addClass("card")
                        var windData = $("<p>").addClass("wind").text("Wind speed: " + data.wind.speed + " mph");
                        var tempData = $("<p>").addClass("temp").text("Temperature: " + data.main.temp);
                        var humidityData = $("<p>").addClass("humidity").text("Humidity: " + data.main.humidity + "%");
                        var image = $("<img>").addClass("icon").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
                        var cardBody = $("<div>").addClass("cardBody");
                        title.append(image);
                        cardBody.append(title, tempData, windData, humidityData);
                        card.append(cardBody);
                        $("#currentWeather").append(card);
                        
                        getUVIndex(data.coord.lat, data.coord.lon);
                        getForecast(searchValue);
                        makeRow(searchValue);
                        
                    }   
                
            });
    


    };
        
        



//uv index
    function getUVIndex(lat, lon) {

    var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=137be5185dbcc5d4f1527c85d91ed486&lat=" + lat + "&lon=" + lon
        $.ajax({
            type: "GET",
            url: uvQueryURL,
            dataType: "json",
            success: function(data) {

                console.log(uvQueryURL);

                var uv = $("<p>").text("UV Index: ");
                var btn = $("<span>").addClass("btn btn-sm").text(data.value);
        
                if(data.value < 3) {
                    btn.addClass("btn-success");
                }
                else if (data.value < 7) {
                 btn.addClass("btn-warning");   
                }
                else {
                    btn.addClass("btn-danger");
                }
        
                $("#currentWeather .cardBody").append(uv.append(btn));
            
            }
        });
        
        

    }

    var history = JSON.parse(window.localStorage.getItem(".history")) || [];

    if (history.length > 0) {
        searchWeather(history[history.length - 1])
    }
  
    for (var i = 0; i < history.length; i++) {
        makeRow(history[i]);

    }

    //5 day weather data:
    function getForecast(searchValue) {
        $("#forecastBox").empty();
        
        var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=" + apiKey + "&units=imperial"
       console.log(forecastQueryURL);
        $.ajax({

            type: "GET",
            url: forecastQueryURL,
            datatype: "json",
            success: function(data) {


            for (var i = 0; i < data.list.length; i++) {

                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                    //console.log("here i am")
                    var column = $("<div>").addClass("forecast col-sm");
                    var card = $("<div>").addClass("card");
                    var body = $("<div>").addClass("card-body");
                    
                    var title = $("<h5>").addClass("date").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    //console.log(data.list[i].weather[0]);
                    var image = $("<img>").addClass("icon").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                    var temp = $("<p>").addClass("temp").text("Temperature: " + data.list[i].main.temp);
                    
                    body.append(title, image, temp);
                    column.append(card.append(body.append()));
                    $("#forecastBox").append(column);
                }
            }    
                
        
    }
    
});

        
    }
