<template>
  <Forecastchart/>
</template>

<script>
import Forecastchart from '../components/Forecastchart.vue';

export default {
  name: 'Forecastchartview',
  components: {
    Forecastchart
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
