<template>
    <h3>这里是提交视图</h3>
    <p>暂时绘制一个学生的提交图，提前算好数据给定id就能绘制，目前只能zoom缩放</p>
    <div class="svgContainer" style="height: 200px; width: auto;"></div>
</template>

<script>    
import * as d3 from 'd3'
import Rosedata from '../../public/data/Rosedata.json'
import { knowledgeOrder, colorOfRose } from '@/utils/asset';
export default {
    data() {
        return {
            roseobj: Rosedata[0],
            layout:{
                "HEIGHT": 200,
                "WIDTH": 600,
                "MarginTop": 5,
                "MarginLeft": 50,
                "MarginBottom": 50,
                "MarginRight": 5,
            }
        };
    },
    mounted() {
        const svg = this.init_svg(this.layout);
        this.drawColumnRose(svg, this.roseobj, this.layout);
    },
    methods: {
        init_svg(layout){
            // TBD 根据容器宽高计算svg的宽高
            const svg = d3.select(".svgContainer").append("svg")
                .attr("viewBox", [0, 0, layout.WIDTH, layout.HEIGHT])
                .attr("width", layout.WIDTH)
                .attr("height", layout.HEIGHT)
                .attr("style", "max-width: 100%; height: auto;");
            return svg;
        },
        drawColumnRose(svg, data, layout) {
            // 转换时间格式
            data.roseArr.map((item) => {
                item.timeFormatted = new Date(item.time * 1000).toLocaleString();
                return item;
            });

            // 配置
            const xScale = d3.scaleTime()
                .domain(d3.extent(data.roseArr, d => new Date(d.timeFormatted)))
                .range([layout.MarginLeft, layout.WIDTH-layout.MarginRight]);
            const xAxis = d3.axisBottom(xScale).tickArguments([d3.timeWeek.every(1)]);
            const RADIUS = 30;
            const R_Scale = d3.scaleLinear().domain([0, 1]).range([0, RADIUS]);
            const arc = d3.arc()
                .startAngle((d,i) => knowledgeOrder.Radian[i].sa)
                .endAngle((d,i) => knowledgeOrder.Radian[i].ea) 
                .padAngle(0.05)
                .innerRadius(0)
                .outerRadius(d => R_Scale(d));

            // 中心点
            svg.append("g")
                .selectAll("circle")
                .data(data.roseArr)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(new Date(d.timeFormatted)))
                .attr("cy", layout.HEIGHT-layout.MarginBottom)
                .attr("r", 5)
                .attr("opacity", 0.5)
                .attr("fill", "red");

            // rose图
            const roseGroup = svg.append("g").attr("name", "roseGroup")
            roseGroup.selectAll('g')
                .data(data.roseArr)
                .enter()
                .append("g")
                .attr("class", "rose")
                .attr("transform", (d)=>`translate(${xScale(new Date(d.timeFormatted))}, ${layout.HEIGHT-layout.MarginBottom})`)
                .selectAll("path")
                .data((d)=>d.rose)
                .enter()
                .append("path")
                .attr("d", arc)
                .attr("fill", (d,i) => colorOfRose(i))
                .attr("opacity", 0.5) 

            // x轴
            const gx = svg.append("g")
                .attr("transform", `translate(0, ${layout.HEIGHT - layout.MarginBottom})`)
                .call(xAxis);

            // 缩放事件的回调函数
            function zoom(svg) {
                const extent = [
                    [layout.MarginLeft, layout.MarginTop], 
                    [layout.WIDTH - layout.MarginRight, layout.HEIGHT - layout.MarginTop]
                ];

                svg.call(d3.zoom()
                    .scaleExtent([1, 5000])//缩放倍数
                    .translateExtent(extent)
                    .extent(extent)
                    .on("zoom", (event)=>{
                        // 更新比例尺xScale
                        xScale.range([layout.MarginLeft, layout.WIDTH-layout.MarginRight].map(d => event.transform.applyX(d)));
                        
                        // 重新设置元素的位置
                        svg.selectAll("circle").attr("cx", d => xScale(new Date(d.timeFormatted)));
                        svg.selectAll(".rose").attr("transform", (d)=>`translate(${xScale(new Date(d.timeFormatted))}, ${layout.HEIGHT-layout.MarginBottom})`);

                        // 调整标签密度
                        const zoomScale = d3.zoomTransform(svg.node()).k / 200;
                        xAxis.tickValues(xScale.ticks(innerWidth * zoomScale));
                        gx.call(xAxis);

                    })
                );
            }
            svg.call(zoom);
        }
    },
}
</script>