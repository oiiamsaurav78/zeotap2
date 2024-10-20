// let weather = {
//     apiKey: "d2e724031d97fb3b62db5b53eebf530a",
let weather = {
    apiKey: "d2e724031d97fb3b62db5b53eebf530a",
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/forecast?q="
            + city
            + "&units=metric&appid="
            + this.apiKey
        )
        .then((response) => {
            if (!response.ok) {
                alert("No weather found.");
                throw new Error("No weather found.");
            }
            return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { name } = data.city;
        const { icon, description } = data.list[0].weather[0];
        const { temp, feels_like, humidity, speed } = data.list[0].main;
        const datetime = data.list[0].dt_txt;

        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".dt").innerText = "Last updated: " + datetime;

        const selectedUnit = document.getElementById("deg").value;

        document.querySelector(".temp").innerText = this.convertTemp(temp, selectedUnit) + " °" + selectedUnit;
        document.querySelector(".temp-feels-like").innerText = "Feels like: " + this.convertTemp(feels_like, selectedUnit) + " °" + selectedUnit;
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";

        this.updateBackground(description);
        this.updateForecast(data, selectedUnit);
    },
    updateBackground: function (description) {
        let bgImage;
        if (description.includes("clear")) {
            bgImage = 'sunny.jpg';
        } else if (description.includes("cloud")) {
            bgImage = 'cloudy.jpg';
        } else if (description.includes("rain")) {
            bgImage = 'rain.jpg';
        }
        document.body.style.backgroundImage = `url('./media/${bgImage}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    },
    updateForecast: function (data, selectedUnit) {
        for (let i = 1; i <= 5; i++) {
            const forecast = data.list[i];
            const temp = forecast.main.temp;
            const icon = forecast.weather[0].icon;
            const datetime = forecast.dt_txt.split(" ")[0];

            document.querySelector(`.temp${i}`).innerText = this.convertTemp(temp, selectedUnit) + " °" + selectedUnit;
            document.querySelector(`.dt${i}`).innerText = datetime;
            document.querySelector(`.icon${i}`).src = "https://openweathermap.org/img/wn/" + icon + ".png";
        }
    },
    convertTemp: function (temp, unit) {
        if (unit === "F") {
            return ((temp * 9 / 5) + 32).toFixed(2);
        } else if (unit === "K") {
            return (temp + 273.15).toFixed(2);
        } else {
            return temp.toFixed(2);
        }
    },
};

document.querySelector(".search-btn").addEventListener("click", function () {
    const city = document.querySelector(".search-bar").value;
    weather.fetchWeather(city);
});

document.querySelector(".search-bar").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        const city = document.querySelector(".search-bar").value;
        weather.fetchWeather(city);
    }
});
