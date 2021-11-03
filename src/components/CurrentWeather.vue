<template>
  <div class="container">
    <h2>Où :</h2>
    <select v-model="selected">
      <option disabled value="">Sélectionnez une ville</option>
      <option v-for="item in items" :key="item">{{ item }}</option>
    </select>
    <br />
    <button class="button" v-on:click="search">Search</button>
  </div>

  <div class="container" v-if="selectedTown && !error">
    <h1>Météo actuelle à {{ town }}</h1>
    <h2>Température : {{ temperature }} °C</h2>
    <h3>Date : {{ date }}</h3>
  </div>

  <div class="container" v-if="error">
    <h3 style="color:red;">{{ errorMessage }}</h3>
  </div>

  <button class="button" v-on:click="goHome">Retour à l'accueil</button>
</template>

<script>
import moment from 'moment';
import 'moment/locale/fr';
import axios from 'axios';


export default {
    name: 'CurrentWeather',
    data () {
        return {
            selected: '',
            items: ['Dubaï', 'Paris', 'Mexico', 'Berlin', 'New york', 'Nantes', 'Jérusalem', 'Londre'],
            town: '',
            temperature: null,
            date: moment().format('LL'),
            selectedTown: false,
            error: false,
            errorMessage: ''
        };
    },
    props: [],
    mounted() {
        this.ifParamsTown();
    },
    methods: {
        search (event) {
            if (event) {
              if (this.selected !== '') {
                this.selected = this.selected.toLowerCase();
                this.$router.push({ name: 'townweather', params: { town: this.selected } });
                this.$route.params.town = this.selected;
                this.ifParamsTown();
              }
            }
        },
        refreshCurrentWeather() {
            let token = "ae3de3b0293f9dfb9005174a39b420f9";
            let url = "https://api.openweathermap.org/data/2.5/weather";
            console.log(this.town)
            axios.get(`${url}?q=${this.town}&appid=${token}`)
            .then( (response) => {
              const temperatureK = response.data.main.temp;
              const temperatureC = temperatureK - 273.15;
              this.temperature = parseInt(temperatureC);
              this.error = false;
            },
            (response) => {
              console.log(response);
              this.error = true;
              this.errorMessage = `Impossible de récupèrer la température actuelle de ${this.town}`;
          });
        },
        getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        },
        ifParamsTown() {
            if (this.$route.params.town) {
                this.selected = this.$route.params.town;
                this.selected = this.selected.charAt(0).toUpperCase() + this.selected.slice(1);
                this.town = this.selected;
                this.selectedTown = true;
                this.refreshCurrentWeather();
            }
        },
        goHome (event) {
            if (event) {
                this.$router.push({ name: 'home' });
            }
        }
    }
}
</script>

<style>
h1 {
  font-size: 2em;
  text-align: center;
}
.container {
  background-color: darkgray;
  padding: 25px;
  margin-left: 250px;
  margin-right: 250px;
  margin-bottom: 25px;
  border-radius: 5px;
}
.button {
  background-color: rgb(0, 68, 255);
  margin-top: 25px;
  margin-bottom: 25px;
  border-radius: 5px;
  color: whitesmoke;
}
</style>
