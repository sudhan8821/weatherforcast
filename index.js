let weatherAPIKey = "4e988398114a6b1b9bab8d63044e4427";
let weatherBaseEndPoint =
  "https://api.openweathermap.org/data/2.5/weather?appid=" +
  weatherAPIKey +
  "&units=metric";
let forecastBaseEndpoint =
  "https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=" +
  weatherAPIKey;
let geocodingBaseEndpoint =
  "http://api.openweathermap.org/geo/1.0/direct?limit=5&appid=" +
  weatherAPIKey +
  "&q=";

let searchInp = document.querySelector(".weather_search");
let city = document.querySelector(".weather_city");
let day = document.querySelector(".weather_day");
let humidity = document.querySelector(".weather_indicator--humidity>.value");
let wind = document.querySelector(".weather_indicator--wind>.value");
let pressure = document.querySelector(".weather_indicator--pressure>.value");
let temperature = document.querySelector(".weather_temperature>.value");
let image = document.querySelector(".weather_image");
let forecastBlock = document.querySelector(".weather_forecast");
let suggestions=document.getElementById("suggestions");
let weatherImages = [
  {
    url: "./broken-clouds.png",
    ids: [803, 804],
  },
  {
    url: "./clear-sky.png",
    ids: [800],
  },
  {
    url: "./few-clouds.png",
    ids: [801],
  },
  {
    url: "./mist.png",
    ids: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
  },
  {
    url: "./rain.png",
    ids: [500, 501, 502, 503, 504],
  },
  {
    url: "./scattered-clouds.png",
    ids: [802],
  },
  {
    url: "./shower-rain.png",
    ids: [520, 521, 522, 531, 300, 301, 302, 310, 311, 312, 313, 314, 321],
  },
  {
    url: "./snow.png",
    ids: [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
  },
  {
    url: "./thunderstorm.png",
    ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
  },
];

let getWeatherByCityName = async (city) => {
  let endPoint = weatherBaseEndPoint + "&q=" + city;
  let response = await fetch(endPoint);
  let weather = await response.json();
  return weather;
};
let getForecastByCityID = async (id) => {
  let endpoint = forecastBaseEndpoint + "&id=" + id;
  let result = await fetch(endpoint);
  let forecast = await result.json();
  let forecastList = forecast.list;
  let daily = [];
  forecastList.forEach((day) => {
    let date_txt = day.dt_txt;
    date_txt = date_txt.replace(" ", "T");
    let date = new Date(date_txt);
    let hours = date.getHours();
    if (hours === 12) {
      daily.push(day);
    }
  });
  //console.log(daily);
  return daily;
};

let updateCurrentWeather = (data) => {
  //console.log(data);
  city.innerText = data.name;
  day.innerText = dayOfWeek();
  // console.log("Current day:" + day.innerText);
  humidity.innerText = data.main.humidity;
  pressure.innerText = data.main.pressure;
  let windDirection;
  let deg = data.wind.deg;
  if (deg > 45 && deg <= 135) {
    windDirection = "East";
  } else if (deg > 135 && deg <= 225) {
    windDirection = "South";
  } else if (deg > 225 && deg <= 315) {
    windDirection = "West";
  } else {
    windDirection = "North";
  }
  wind.innerText = windDirection + "," + data.wind.speed;
  temperature.innerHTML =
    data.main.temp > 0
      ? "+" + Math.round(data.main.temp)
      : Math.round(data.main.temp);
  let imgID = data.weather[0].id;
  weatherImages.forEach((obj) => {
    if (obj.ids.indexOf(imgID) != -1) {
      image.src = obj.url;
    }
  });
};
let dayOfWeek = (dt = new Date().getTime()) => {
  let today = new Date(dt).toLocaleDateString("en-EN", { weekday: "long" });
  return today;
};
 


var weatherForCity = async (city) => {
   weather = await getWeatherByCityName(city);
   if(weather.cod==="404")
   {
      swal.fire({
        icon:"error",
        title:"You Typed Wrong City Name"
      })
      return;
   }
   updateCurrentWeather(weather);

  // console.log(weather);
  let cityID = weather.id;
  let forecast = await getForecastByCityID(cityID);
  updateForecast(forecast);
};
searchInp.addEventListener("keydown", async (e) => {
  if (e.keyCode === 13) {
    weatherForCity(searchInp.value);
  }
});
searchInp.addEventListener("input", async () => {
  if (searchInp.value.length <= 2) {
    return;
  }
  suggestions.innerHTML="";
  let endpoint = geocodingBaseEndpoint + searchInp.value;
  let result = await fetch(endpoint);
  result = await result.json();
  result.forEach((city) => {
    suggestions.innerHTML+=`<option value=${city.name},${city.state ? ""+city.state:" "},${city.country}>${city.name},${city.state},${city.country}</option>`
  });
});
let updateForecast = (forecast) => {
  forecastBlock.innerHTML = "";
  let forecastItem = "";
  forecast.forEach((day) => {
    let iconUrl =
      "http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png";
    let temperature =
      day.main.temp > 0
        ? "+" + Math.round(day.main.temp)
        : Math.round(day.main.temp);
    let dayName = dayOfWeek(day.dt * 1000);
    //console.log(dayName);
    forecastItem += `
    <article class="weather_forecast_item col-lg-2 col-md-6 col-12">
    <img
      src="${iconUrl}"
      alt="${day.weather[0].description}"
      class="weather_forecast_icon"
    />
    <h3 class="weather_forecast_day">${dayName}</h3>
    <p class="weather_forecast_temperature">
      <span class="value">${temperature}</span> &deg;C
    </p>
  </article>
    `
  });
  forecastBlock.innerHTML = forecastItem;
};
  var lat,lon;
  var promise1 =new Promise(function(resolve,reject){
    let options={enableHighFrequency:true,timeout:5000,maxmimumAge:0};
  navigator.geolocation.getCurrentPosition((success)=>{
    lat=success.coords.latitude;
    lon=success.coords.longitude;
    resolve({lat,lon})
},(error)=>{
    reject("Error is Come");
},options)
})
// let weatherAPIKey = "4e988398114a6b1b9bab8d63044e4427";
 async function show(){
     let data=await promise1;
    //  console.log(lat);
     let point="https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid="+weatherAPIKey;
    //  let point1=basepoint+lat+"&lon="+lon;
    //  console.log(point);
     let response=await fetch(point);
     let result=await response.json();
    //  console.log(result);
    //  console.log(result.name);
     let c=result.name;
     swal.fire(
       {
        icon:'success',
        title:`Got Your Location: ${c}`,
       }
     )
     weatherForCity(c);
   };
 window.onload=show;

