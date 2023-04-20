import React, { useEffect, useState } from "react";
import styles from "./styles.css";
// import { BiSearch, BiLoaderAlt } from "react-icons/bi";
// import { AiOutlineEye, AiOutlineHeart } from "react-icons/ai";
// import { CgDrop } from "react-icons/cg";
// import { CiTempHigh } from "react-icons/ci";
// import { WiStrongWind } from "react-icons/wi";
// import {
//     BsSunFill,
//     BsCloudsFill,
//     BsFillCloudRainHeavyFill,
//     BsCloudFog2,
//     BsSnow,
// } from "react-icons/bs";
// import { VscError } from "react-icons/vsc";

import Table from "./Table";

const API_KEY = "cda6a15e090c3937b3727e2ebb36a1ed";

const CURRENT = "current";
const HOURS3 = "3hours";
const DAYS5 = "5days";

const WeatherApp = (props) => {
  const [input, setInput] = useState("London");
  const [period, setPeriod] = useState("current");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [weatherData, setWeatherData] = useState({
    [CURRENT]: [],
    [HOURS3]: [],
    [DAYS5]: []
  });

  useEffect(() => {
    fetchWeather(); // initial fetch
  }, []);

  const handleInput = (event) => {
    event.preventDefault();
    setInput(event.target.value);
  };

  const handleChangePeriod = (event) => {
    setPeriod(event.target.value);
  };

  return (
    <>
      <fieldset className='table'>
        <legend className='table'>Select weather interval:</legend>
        <input
          type="radio"
          id={CURRENT}
          name="period"
          value={CURRENT}
          checked={period === CURRENT}
          onChange={handleChangePeriod}
        />
        <label htmlFor={CURRENT} className='table'>CURRENT</label>
        <input
          type="radio"
          id={HOURS3}
          name="period"
          value={HOURS3}
          checked={period === HOURS3}
          onChange={handleChangePeriod}
        />
        <label htmlFor={HOURS3} className='table'>3 HOURS</label>
        <input
          type="radio"
          id={DAYS5}
          name="period"
          value={DAYS5}
          checked={period === DAYS5}
          onChange={handleChangePeriod}
        />
        <label htmlFor={DAYS5} className='table'>5 DAYS</label>
      </fieldset>
      <div>&nbsp;</div>

        <div className='handleInput'>
        <input value={input} onChange={handleInput} className='input' />
        <button onClick={fetchWeather} className='button'>REQUEST DATA</button>
        <div>&nbsp;</div>
        </div>

      <Table weatherData={weatherData[period]} />
    </>
  );

  function fetchWeather() {
    // TODO: that function should be separate from the component
    fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${input}&appid=${API_KEY}`
    ) // Promise
      .then((response) => response.json()) // JSON
      .then((direct) => {


        // TODO: that function can be flat
        const data = direct[0];
        const lat = data.lat;
        const lon = data.lon;
        fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        )
          .then((response) => response.json())
          .then(function (weather) {
            const data = {};

            const currentDate = new Date(
              weather.current.dt * 1000
            ).toUTCString();
            const currentTemperature = weather.current.temp;
            const currentConditions = weather.current.weather[0].main;
            const currentWeatherData = [
              {
                date: currentDate,
                temperature: currentTemperature,
                conditions: currentConditions
              }
            ];
            data[CURRENT] = currentWeatherData;

            const hourlyArray = weather.hourly.slice(0, 3);
            const hourlyWeatherData = hourlyArray.map((hour) => {
              const date = new Date(hour.dt * 1000).toUTCString();
              const temperature = hour.temp;
              const conditions = hour.weather[0].main;
              return { date, temperature, conditions };
            });
            data[HOURS3] = hourlyWeatherData;

            const dailyArray = weather.daily.slice(0, 5);
            const dailyWeatherData = dailyArray.map((day) => {
              const date = new Date(day.dt * 1000).toUTCString();
              const temperature = day.temp.day;
              const conditions = day.weather[0].main;
              return { date, temperature, conditions };
            });
            data[DAYS5] = dailyWeatherData;

            setWeatherData(data);
          });
      });
  }
};

export default WeatherApp;
