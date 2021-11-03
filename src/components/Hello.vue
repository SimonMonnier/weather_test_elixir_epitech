<template>
  <div class="container">
    <svg></svg>
  </div>
</template>
<script>
import * as d3 from 'd3';
export default {
  data() {
    return {};
  },
  mounted() {
    const months = ['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'ноя', 'дек'];
    const count = 3;
    const data = [];

    months.forEach((month) => {
      const values = [];

      for (var i = 0; i < count; i++) {
        values.push({ key: i, value: Math.round(Math.random() * 100) / 100 });
      }
      data.push({ month, values });
    });

    const width = 600;
    const height = 400;
    const margin = { top: 25, right: 25, bottom: 25, left: 25 };

    const svg = d3
      .select('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand().domain(months).range([0, width]).padding(0.1);

    const xInnerDomain = data[0].values.keys();
    const xInnerScale = d3.scaleBand().domain(xInnerDomain).rangeRound([0, xScale.bandwidth()]);

    const yDomain = [d3.min(data, (d) => d3.min(d.values.map((v) => v.value))), d3.max(data, (d) => d3.max(d.values.map((v) => v.value)))];
    const yScale = d3.scaleLinear().domain(yDomain).range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale));
    svg.append('g').call(d3.axisLeft(yScale));

    const barGroup = svg
      .selectAll('.group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'group')
      .attr('transform', (d) => `translate(${xScale(d.month)},0)`);

    barGroup
      .selectAll('rect')
      .data((d) => d.values)
      .enter()
      .append('rect')
      .attr('width', xInnerScale.bandwidth())
      .attr('x', (d) => xInnerScale(d.key))
      .style('fill', (d) => colorScale(d.key))
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => height - yScale(d.value));
  },
};
</script>
<style>
.container {
  background-color: darkgray;
  padding: 25px;
  margin-left: 250px;
  margin-right: 250px;
  margin-bottom: 25px;
  border-radius: 5px;
}
</style>
