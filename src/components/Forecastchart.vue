<template>
  <div class="container">
    <h2>Où :</h2>
    <select v-model="selected">
      <option disabled value="">Sélectionnez une ville</option>
      <option v-for="item in items" :key="item">{{ item }}</option>
    </select>
    <br />
    <button class="buttonSearch" v-on:click="search">Météo Actuelle</button>
    <button class="buttonForecast" v-on:click="forecast">Prévision des températures maximales</button>
  </div>

  <div class="container" v-if="selectedTown && !error">
    <h1>Températures maximales des 5 prochains jours à {{ town }}</h1>
  </div>

  <div class="container" v-html="chartInString" v-if="selectedTown && !error"></div>

  <div class="container" v-if="error">
    <h3 style="color:red;">{{ errorMessage }}</h3>
  </div>

  <button class="button" v-on:click="goHome">Retour à l'accueil</button>
</template>

<script>
import moment from 'moment';
import 'moment/locale/fr';
import axios from 'axios';
import * as d3 from "d3";


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
            errorMessage: '',
            chart: null,
            chartInString: ''
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
            let url = "https://api.openweathermap.org/data/2.5/forecast";
            axios.get(`${url}?q=${this.town}&appid=${token}`)
            .then( (response) => {

              const datas = response.data.list;
              
              this.chart = this.BarChart(datas, {
                x: d => d.main.temp - 273.15,
                y: d => d.dt_txt,
                yDomain: d3.groupSort(datas, ([d]) => -d.main.temp, d => d.dt_txt), // sort by descending frequency
                xLabel: "Dates →",
                color: "steelblue"
              });
              if (this.chart !== null) {
                let s = new XMLSerializer();
                this.chartInString = s.serializeToString(this.chart);
                this.chartInString = this.Vue.compile(this.chartInString);
              }
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
        },
        forecast (event) {
          if (event) {
              if (this.selected !== '') {
                this.selected = this.selected.toLowerCase();
                this.$router.push({ name: 'forecastchart', params: { town: this.selected } });
                this.$route.params.town = this.selected;
                this.ifParamsTown();
              }
            }
        },
        BarChart(data, {
          x = d => d, // given d in data, returns the (quantitative) x-value
          y = (d, i) => i, // given d in data, returns the (ordinal) y-value
          title, // given d in data, returns the title text
          marginTop = 30, // the top margin, in pixels
          marginRight = 0, // the right margin, in pixels
          marginBottom = 10, // the bottom margin, in pixels
          marginLeft = 30, // the left margin, in pixels
          width = 640, // the outer width of the chart, in pixels
          height, // outer height, in pixels
          xType = d3.scaleLinear, // type of x-scale
          xDomain, // [xmin, xmax]
          xRange = [marginLeft, width - marginRight], // [left, right]
          xFormat, // a format specifier string for the x-axis
          xLabel, // a label for the x-axis
          yPadding = 0.1, // amount of y-range to reserve to separate bars
          yDomain, // an array of (ordinal) y-values
          yRange, // [top, bottom]
          color = "currentColor", // bar fill color
          titleColor = "white", // title fill color when atop bar
          titleAltColor = "currentColor", // title fill color when atop background
        } = {}) {
          // Compute values.
          const X = d3.map(data, x);
          const Y = d3.map(data, y);

          // Compute default domains, and unique the y-domain.
          if (xDomain === undefined) xDomain = [0, d3.max(X)];
          if (yDomain === undefined) yDomain = Y;
          yDomain = new d3.InternSet(yDomain);

          // Omit any data not present in the y-domain.
          const I = d3.range(X.length).filter(i => yDomain.has(Y[i]));

          // Compute the default height.
          if (height === undefined) height = Math.ceil((yDomain.size + yPadding) * 25) + marginTop + marginBottom;
          if (yRange === undefined) yRange = [marginTop, height - marginBottom];

          // Construct scales and axes.
          const xScale = xType(xDomain, xRange);
          const yScale = d3.scaleBand(yDomain, yRange).padding(yPadding);
          const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
          const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

          // Compute titles.
          if (title === undefined) {
            const formatValue = xScale.tickFormat(100, xFormat);
            title = i => `${formatValue(X[i])}`;
          } else {
            const O = d3.map(data, d => d);
            const T = title;
            title = i => T(O[i], i, data);
          }

          const svg = d3.create("svg")
              .attr("width", width)
              .attr("height", height)
              .attr("viewBox", [0, 0, width, height])
              .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

          svg.append("g")
              .attr("transform", `translate(0,${marginTop})`)
              .call(xAxis)
              .call(g => g.select(".domain").remove())
              .call(g => g.selectAll(".tick line").clone()
                  .attr("y2", height - marginTop - marginBottom)
                  .attr("stroke-opacity", 0.1))
              .call(g => g.append("text")
                  .attr("x", width - marginRight)
                  .attr("y", -22)
                  .attr("fill", "currentColor")
                  .attr("text-anchor", "end")
                  .text(xLabel));

          svg.append("g")
              .attr("fill", color)
            .selectAll("rect")
            .data(I)
            .join("rect")
              .attr("x", xScale(0))
              .attr("y", i => yScale(Y[i]))
              .attr("width", i => xScale(X[i]) - xScale(0))
              .attr("height", yScale.bandwidth());

          svg.append("g")
              .attr("fill", titleColor)
              .attr("text-anchor", "end")
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
            .selectAll("text")
            .data(I)
            .join("text")
              .attr("x", i => xScale(X[i]))
              .attr("y", i => yScale(Y[i]) + yScale.bandwidth() / 2)
              .attr("dy", "0.35em")
              .attr("dx", -4)
              .text(title)
              .call(text => text.filter(i => xScale(X[i]) - xScale(0) < 20) // short bars
                  .attr("dx", +4)
                  .attr("fill", titleAltColor)
                  .attr("text-anchor", "start"));

          svg.append("g")
              .attr("transform", `translate(${marginLeft},0)`)
              .call(yAxis);

          return svg.node();
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
.buttonSearch {
  background-color: rgb(0, 68, 255);
  margin-top: 25px;
  margin-bottom: 25px;
  border-radius: 5px;
  color: whitesmoke;
}
.buttonForecast {
  background-color: rgb(177, 9, 211);
  margin-top: 25px;
  margin-left: 5px;
  margin-bottom: 25px;
  border-radius: 5px;
  color: whitesmoke;
}
</style>
