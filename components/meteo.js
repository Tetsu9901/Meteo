import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const APIkey = "0552deb391a2bfe2a6306d2c085a9ac8"; 

const formatDate = (date) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

const getCurrentDay = () => {
  const date = new Date();
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  return days[date.getDay()];
}


const Meteo = ({lat, long}) => {

  const [meteoData, setMeteoData] = useState(null);
  const [meteoIcon, setMeteoIcon] = useState(null);
  const [foreCastMeteoData, setForeCastMeteoData] = useState(null);
  const [foreCastMeteoIcon, setForeCastMeteoIcon] = useState(null);

  
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

    const fetchForeCastMeteoData = () => {
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&yon&units=metric&lang=fr&appid=${APIkey}`
      )
        .then(response => response.json())
        .then(data => {
          const showOnlyMiddayForecast = data.list.filter((forecast, index) => {
            return forecast.dt_txt.includes('12:00:00');
          });
          data.list = showOnlyMiddayForecast;
          setForeCastMeteoData(data);
          console.log(data);
        })
        .catch(error => console.error(error));
    };

    formatDate();
    fetchForeCastMeteoData();
  }, []);

  return (
  <View> 
      <Text style={styles.titre}>Météo</Text>
    {meteoData &&
    <View>
      <View style={styles.mainMeteo}>
        <Text style={styles.text}>Vous etes à : {meteoData.name}</Text>
        <Text style={styles.text}>{meteoData.main?.temp} °C</Text>
        {meteoIcon ? 
          <Image source={{ uri: meteoIcon}} style={styles.icons} /> : null
        }
        <Text style={styles.text}>{meteoData.weather[0].description}</Text>
      </View>
      <Text style={styles.textPrev}>Prévisions météo pour les 5 prochains jours à 12h00 :</Text>
        <ScrollView horizontal={true} style={styles.scroll}>
          {foreCastMeteoData && foreCastMeteoData.list.map((forecast, index) => {
            return (
                <View style={styles.card}>
                  <Text style={styles.text}>{formatDate(forecast.dt_txt)}</Text>
                  <Text style={styles.text}>{forecast.main?.temp} °C</Text>
                  {forecast.weather[0].icon ? 
                    <Image source={{ uri: `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}} style={styles.icons} /> : null
                  }
                  <Text style={styles.text}>{forecast.weather[0].description}</Text>
                </View>
            );
          })
          }
        </ScrollView>
      </View>
    }
  </View>
  );
};

const styles = StyleSheet.create({
  titre: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 130,
  },
  mainMeteo: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  textPrev: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  icons: {
    width: 75,
    height: 75,
  },
  scroll: {
    marginLeft: 7,
  },
  card: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: 210,
    height: 290,
    margin: 8,
    borderRadius: 10,
  },
});
export default Meteo;
