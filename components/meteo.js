import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";

const APIkey = "0552deb391a2bfe2a6306d2c085a9ac8"; 

const Meteo = ({lat, long}) => {

  const [meteoData, setMeteoData] = useState(null);
  const [meteoIcon, setMeteoIcon] = useState(null);

  
  useEffect(() => {
    const fetchMeteoData = () => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&yon&units=metric&lang=fr&appid=${APIkey}`
      )
        .then(response => response.json())
        .then(data => {
          setMeteoData(data);
          setMeteoIcon(`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
        })
        .catch(error => console.error(error));
    };

    fetchMeteoData();
  }, []);

  return (
  <View>
    {meteoData ? (
      <View>
        <Text>Vous etes à : {meteoData.name}</Text>
        <Text>{meteoData.main?.temp} °C</Text>
        {meteoIcon ? 
          <Image source={{ uri: meteoIcon}} style={{ width: 55, height: 55}} /> : null
        }
        <Text>{meteoData.weather[0].description}</Text>
      </View>
    ) : (
      <Text>Loading...</Text>
    )}
  </View>
  );
};


export default Meteo;
