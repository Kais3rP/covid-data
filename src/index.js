import * as d3 from "d3";

async function covidGraph() {
   try {
      let covidDataSet = [];
      const res = await fetch('https://cors-anywhere.herokuapp.com/https://opendata.ecdc.europa.eu/covid19/casedistribution/json/', { headers: { 'Accept': 'application/json' } })
      const data = await res.json()
      const covidData = data.records

      //Hide loader when data is received
      document.getElementsByClassName('title')[0].style = "display: block"
      document.getElementsByClassName('loader')[0].style = "display: none"

      for (let el of covidData) el.countryterritoryCode === "ITA" ? covidDataSet.push([el.dateRep, el.deaths_weekly, Math.ceil(parseInt(/\d+$/.exec(el.year_week)[0])/4)]) : null;
      covidDataSet = covidDataSet.reverse()
      const color = "#FF3B3F"
      const hoverColor = "#3C403D"

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const padding = 30;
      const w = windowWidth;
      const h = windowHeight;

      const colWidth = Math.floor(w - 5 * padding) / (covidDataSet.length);

      //Reset all body content before a redraw
      document.querySelector(".graph").innerHTML = ""

      const xScaleAxis = d3.scaleLinear()
         .domain([d3.min(covidDataSet, (d) => d[2]), d3.max(covidDataSet, (d) => d[2])])
         .range([padding, w - padding])

      const yScale = d3.scaleLinear()
         .domain([0, d3.max(covidDataSet, (d) => d[1])])
         .range([0, h - 3 * padding])
        

      const yScaleAxis = d3.scaleLinear()
         .domain([0, d3.max(covidDataSet, (d) => d[1])])
         .range([h - 3 * padding, 0])

      const toolTip = d3.select(".graph")
         .append("div")
         .attr("class", "tooltip")
         .style("display", "none")

      const svg = d3.select('.graph')
         .append("svg")
         .attr("class", "graphic")
         .attr("preserveAspectRatio", "xMinYMin meet")
         .attr("viewBox", `0 0 ${w} ${h}`)


      svg.selectAll("rect")
         .data(covidDataSet)
         .enter()
         .append("rect")
         .attr("width", colWidth)
         .attr("height", (d) => d[1] > 0 ? yScale(d[1]) : 1)
         .attr("x", (d, i) => 2 * padding + i * colWidth)
         .attr("y", (d, i) => h - yScale(d[1]) - 2 * padding)
         .attr("fill", color)
         .on('mouseover', function (d, i) {

            d3.select(this).attr("fill", hoverColor);
            toolTip.transition().duration(200).style("display", "inline");
            toolTip.text(() => `${d[0]}: ${d[1]} deaths`)
               .style("top", `${h / 2}px`)
               .style("left", `${i * colWidth}px`)
         })
         .on('mouseout', function () {
            d3.select(this).attr("fill", color);
            toolTip.transition().duration(200).style("display", "none");
         })

      const xAxis = d3.axisBottom(xScaleAxis)
         .ticks(6)
      const yAxis = d3.axisLeft(yScaleAxis);

      svg.append("g")
         .attr("transform", "translate(" + padding + "," + padding + ")")
         .call(yAxis);

      svg.append("g")
         .attr("transform", "translate(0," + (h - 2 * padding) + ")")
         .call(xAxis);
      svg.append('text')
         .attr('transform', 'rotate(-90)')
         .attr('x', -h / 2)
         .attr('y', 90)
         .text('Deaths of Covid - 19')
         .attr('class', 'axes-text');

      svg.append('text')
         .attr('x', 70)
         .attr('y', h - 70)
         .text('Month')
         .attr('class', 'axes-text');

      svg.append('text')
         .attr('x', padding * 2)
         .attr('y', h - padding)
         .text('Data: https://data.europa.eu/euodp/en/data/dataset/covid-19-coronavirus-data')
         .attr('class', 'info');
         return "Covid data ready"
   } catch (e) {
      throw new Error(e)
   }
}
//Call the graph builder
covidGraph().then(ok => console.log(ok)).catch(e => { console.log(e); document.body.innerText = "Something went wrong :-(" })

/*
let redrawTimeout;
window.onresize = () => {
   clearTimeout(redrawTimeout);
 redrawTimeout = setTimeout(()=> {
   covidGraph().then(ok => console.log("resizing window, refetching and redrawing graph")).catch(e => { console.log(e); document.body.innerText = "Something went wrong :-(" })
  },2000)
}
*/