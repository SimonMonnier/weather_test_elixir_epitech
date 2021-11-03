<template>
  <CurrentWeather/>
</template>

<script>
import CurrentWeather from '../components/CurrentWeather.vue';

export default {
  name: 'TownWeather',
  components: {
    CurrentWeather
  }
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
