var main = function () {
    "use strict";
    var current_city = "bkk";
    var current_mode = "daily";
    var xValues = [];
    var yValues = [];
    var weatherIcons = [];
    var city_coord = {"bkk": {lat: 13.7563,long: 100.5018},
                      "cnx": {lat: 18.7883,long: 98.9853}};
    var weatherChart = function(city,mode){
        console.log("City: "+city+" Mode: "+mode);
        if(current_city!==city){
            $("div.city button").toggleClass("active");
            current_city = city;
        }
        if(current_mode!==mode){
            $("div.mode button").toggleClass("active");
            current_mode = mode;
        }
        //Chart Title Part
        var city_name,mode_name;
        if(current_city==="bkk"){ city_name = "Bangkok";}
        if(current_city==="cnx"){ city_name = "Chiang Mai";}
        if(current_mode==="3hours"){ mode_name = "Every 3 Hours";}
        if(current_mode==="daily"){ mode_name = "Daily";}
        $("h1.title").text("Weather in "+city_name+", "+mode_name);
        //Call API
        $.ajax({ 
            url: "https://api.nostramap.com/Service/V2/GeoLocation/GetWeather", 
            dataType: "jsonp", 
            type: "GET", 
            contentType: "application/json", 
            data: {
                key: "GpP9arOyqKMiqEZlOs192bVJfLVKPCMb2iCoFRNGhmqhPIBWgtpvWDEXM2voBiZMVTi4u6Tn7zkUnXZ8)cv(EVW=====2",
                lat: city_coord[city].lat,
                lon: city_coord[city].long,
                frequency: mode
        },
        success: function (response){
            //Create data for new chart
            var weather = response.results.weather;
            xValues = []; yValues = []; weatherIcons = [];
            if(mode==="daily"){
                weather.forEach(element => {
                    xValues.push(element.timeStamp);
                    yValues.push(element.temperature.temp);
                    weatherIcons.push(element.icon);
                });
            }
            if(mode==="3hours"){
                for(var i=0;i<=7;i++){
                    xValues.push(weather[i].timeStamp);
                    yValues.push(weather[i].temperature.temp);
                    weatherIcons.push(weather[i].icon);
                }
            }
            //Chart Part
            $(".graph").empty();
            $(".graph").append($("<canvas id='weather-chart'>").attr("style","width:1000px;max-width:1000px;"));
            var chart = new Chart("weather-chart", {
                type: "bar",
                data: {
                    labels: xValues,
                    datasets: [{ backgroundColor: "lightblue", data: yValues}]
                },
                options: { 
                    legend: {display: false}, title: {display: false}}
            });
            //Weather Icon Part
            var $weathericon = $(".weather-icon");
            var margin_right;
            if(mode==="daily"){$weathericon.css("left","130px"); margin_right = "76px";}
            if(mode==="3hours"){$weathericon.css("left","124px");margin_right = "60px";}
            $weathericon.empty();
            weatherIcons.forEach(element => {
                $weathericon.append($("<img>").attr("src",element));
            });
            $("img").css("margin-right",margin_right);
        },
        error: function (response){window.alert(response.errorMessage);}
        });
    }
    //Button Event Part
    $("button.bkk").on("click",function(event){weatherChart("bkk",current_mode)});
    $("button.cnx").on("click",function(event){weatherChart("cnx",current_mode)});
    $("button.3hrs").on("click",function(event){weatherChart(current_city,"3hours")});
    $("button.daily").on("click",function(event){weatherChart(current_city,"daily")});
    weatherChart("bkk","daily");
}

$(document).ready(main);