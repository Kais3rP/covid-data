import {covidData} from './covid.js';
import * as d3 from "d3";
//Extraction of pil dataset of[year,pil] from json euro pil data.
var covidDataSet = [];

for (let el of covidData) el.countryterritoryCode === "ITA" ? covidDataSet.push([el.dateRep,el.deaths,parseInt(el.month)]):null;
 
covidDataSet = covidDataSet.reverse().filter(x=>x[2]!==12)


const w = 500;
const h = 500;
const padding = 30;
const colWidth = (w-2*padding)/(covidDataSet.length);


const xScale = d3.scaleLinear()
                 .domain([d3.min(covidDataSet, (d)=>d[2]),d3.max(covidDataSet, (d)=>d[2])])
                 .range([2*padding, w-padding])
                 
                
const yScale = d3.scaleLinear()
                 .domain([0, d3.max(covidDataSet, (d)=>d[1])])
                 .range([0,h-3*padding])
                               
const yScaleAxis = d3.scaleLinear()
                 .domain([0, d3.max(covidDataSet, (d)=>d[1])])
                 .range([h-3*padding,0])
                
                


var toolTip = d3.select("body")
                .append("div")
                .attr("class","tooltip")
                .style("display","none")

var svg = d3.select("body")
            .append("svg")
            .attr("class","graphic")
            .attr("height", h - padding)
            .attr("width", w)

            svg.selectAll("rect")
               .data(covidDataSet)
               .enter()
               .append("rect")
               .attr("width",colWidth)
               .attr("height",(d)=>d[1]>0 ? yScale(d[1]) : 1)
               .attr("x", (d,i)=> 2*padding+i*colWidth)
               .attr("y", (d,i)=> h - yScale(d[1]) - 2*padding)
               .attr("fill", "rgb(173, 173, 173)")
               .on('mouseover', function(d,i){
                  
                   d3.select(this).attr("fill","rgb(49, 49, 49)");
                   toolTip.transition().duration(200).style("display","inline");
                   toolTip.text(()=>`${d[0]}: ${d[1]} deaths`)
                          .style("top",`${h+80}px`)
                          .style("left",`${i*colWidth}px`)
                  })
               .on('mouseout', function(){ 
                  d3.select(this).attr("fill","rgb(173, 173, 173)");
                  toolTip.transition().duration(200).style("display","none");
            })
           
                  

               const xAxis = d3.axisBottom(xScale)
                               .ticks(6)
               const yAxis = d3.axisLeft(yScaleAxis);

               svg.append("g")
                  .attr("transform", "translate("+2*padding+","+padding+ ")")
                  .call(yAxis);

               svg.append("g")
                  .attr("transform", "translate(0,"+(h-2*padding)+ ")")
                  .call(xAxis);
 svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -h/2)
    .attr('y', 90)
    .text('Deaths of Covid - 19')
    .attr('class', 'axes-text');

 svg.append('text')
    .attr('x', 70)
    .attr('y', h- 70)
    .text('Month')
    .attr('class', 'axes-text');
  
 svg.append('text')
    .attr('x', padding*2)
    .attr('y', h-padding)
    .text('Data: https://data.europa.eu/euodp/en/data/dataset/covid-19-coronavirus-data')
    .attr('class', 'info');
