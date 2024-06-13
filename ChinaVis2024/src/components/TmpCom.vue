<template>
    <h1>临时组件</h1>
    <div class="container" style="height: 50vh; width: 100vw;"></div>
</template>

<script>
// import axios from 'axios';
import * as d3 from 'd3';
import jsdata from '../../public/data/OneStudent.json';
export default {
    data() {
        return {
            data: jsdata,
        };
    },
    mounted() {
        this.drawTest(this.data);
    },
    methods: {
        drawTest(data) {
            // 转换时间格式
            data.map((item) => {
                item.timeFormatted = new Date(item.time * 1000).toLocaleString();
                // console.log(item.timeFormatted);
                return item;
            });
            // 绘制散点图
            const width = 928;
            const height = 500;
            const marginTop = 20;
            const marginRight = 0;
            const marginBottom = 30;
            const marginLeft = 40;
            const svg = d3.select(".container").append("svg")
                .attr("color", "red")
                .attr("viewBox", [0, 0, width, height])
                .attr("width", width)
                .attr("height", height)
                .attr("style", "max-width: 100%; height: auto;")
                .call(zoom);
            const xScale = d3.scaleTime()
                .domain(d3.extent(data, d => new Date(d.timeFormatted)))
                .range([marginLeft, width-marginRight]);
            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.score)])
                .range([height-marginBottom, marginTop]);
            const xAxis = d3.axisBottom(xScale);
            const yAxis = d3.axisLeft(yScale);

            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0, ${height - marginBottom})`)
                .call(xAxis);
            svg.append("g")
                .attr("transform", `translate(${marginLeft}, 0)`)
                .call(yAxis);
            const circles = svg.append("g").selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(new Date(d.timeFormatted)))
                .attr("cy", d => yScale(d.score))
                .attr("r", 5)
                .attr("opacity", 0.5)
                .attr("fill", "white");
            
            function zoom(svg) {
                const extent = [[marginLeft, marginTop], [width - marginRight, height - marginTop]];

                svg.call(d3.zoom()
                    .scaleExtent([1, 488])
                    .translateExtent(extent)
                    .extent(extent)
                    .on("zoom", zoomed));

                function zoomed(event) {
                    xScale.range([marginLeft, width - marginRight].map(d => event.transform.applyX(d)));
                    // 重新设置元素的位置
                    svg.selectAll("circle")
                        .attr("cx", d => xScale(new Date(d.timeFormatted)));
                    svg.selectAll(".x-axis").call(xAxis);
                }
            }
        }
    }
 };
</script>