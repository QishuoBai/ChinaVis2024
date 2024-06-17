<template>
    <div ref="container" :id="this.id" style="height: 30px; width: 100%">
        <!-- <p>draw id————{{id}}</p> -->
    </div>
</template>

<script>
import * as d3 from 'd3';
import { knowledgeOrder, colorOfRose } from '@/utils/asset';
export default {
    data() {    
        return {
            layout:{
                "HEIGHT": 40,
                "WIDTH": 200,
                "MarginTop": 0,
                "MarginLeft": 5,
                "MarginBottom": 0,
                "MarginRight": 5,
            },
        }
    },
    props: {
        id: String,
        dataobj: Object,
    },
    mounted() {
        this.init();
        this.drawRose();
    },
    methods: {
        init(){
            // 获取容器的宽高
            this.layout.HEIGHT = this.$refs.container.clientHeight;
            this.layout.WIDTH = this.$refs.container.clientWidth;
        },
        drawRose(){
            // 获取该生数据
            const data = this.dataobj;
            data.roseArr.map((item) => {
                item.timeFormatted = new Date(item.time * 1000).toLocaleString();
                return item;
            });

            const svg = d3.select(this.$refs.container).append('svg')
                .attr('viewBox', [0, 0, this.layout.WIDTH, this.layout.HEIGHT])
                .attr('width', this.layout.WIDTH)
                .attr('height', this.layout.HEIGHT)
                .attr('style', 'max-width: 100%; height: auto;');


            // 配置
            const xScale = d3.scaleTime()
                .domain(d3.extent(data.roseArr, d => new Date(d.timeFormatted)))
                .range([this.layout.MarginLeft, this.layout.WIDTH-this.layout.MarginRight]);
            const xAxis = d3.axisBottom(xScale).tickArguments([d3.timeWeek.every(1)]);
            const RADIUS = this.layout.HEIGHT/2;
            const R_Scale = d3.scaleLinear().domain([0, 1]).range([0, RADIUS]);
            const arc = d3.arc()
                .startAngle((d,i) => knowledgeOrder.Radian[i].sa)
                .endAngle((d,i) => knowledgeOrder.Radian[i].ea) 
                // .padAngle(0.05)
                .innerRadius(0)
                .outerRadius(d => R_Scale(d));

            // 中心点
            svg.append("g").attr("name", "points")
                .selectAll("circle")
                .data(data.roseArr)
                .enter()
                .append("circle")
                .attr("cx", d => xScale(new Date(d.timeFormatted)))
                .attr("cy", this.layout.HEIGHT/2)
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
                .attr("transform", (d)=>`translate(${xScale(new Date(d.timeFormatted))}, ${this.layout.HEIGHT/2})`)
                .selectAll("path")
                .data((d)=>d.rose)
                .enter()
                .append("path")
                .attr("d", arc)
                .attr("fill", (d,i) => colorOfRose(i))
                .attr("opacity", 0.5) 

            // x轴
            const gx = svg.append("g")
                .attr("transform", `translate(0, ${this.layout.HEIGHT/2})`)
                .call(xAxis);

            // 缩放事件的回调函数
            // function zoom(svg) {
            //     const extent = [
            //         [this.layout.MarginLeft, this.layout.MarginTop], 
            //         [this.layout.WIDTH - this.layout.MarginRight, this.layout.HEIGHT - this.layout.MarginTop]
            //     ];

            //     svg.call(d3.zoom()
            //         .scaleExtent([1, 5000])//缩放倍数
            //         .translateExtent(extent)
            //         .extent(extent)
            //         .on("zoom", (event)=>{
            //             // 更新比例尺xScale
            //             xScale.range([this.layout.MarginLeft, this.layout.WIDTH-this.layout.MarginRight].map(d => event.transform.applyX(d)));
                        
            //             // 重新设置元素的位置
            //             svg.selectAll("circle").attr("cx", d => xScale(new Date(d.timeFormatted)));
            //             svg.selectAll(".rose").attr("transform", (d)=>`translate(${xScale(new Date(d.timeFormatted))}, ${this.layout.HEIGHT-layout.MarginBottom})`);

            //             // 调整标签密度
            //             const zoomScale = d3.zoomTransform(svg.node()).k / 200;
            //             xAxis.tickValues(xScale.ticks(innerWidth * zoomScale));
            //             gx.call(xAxis);

            //         })
            //     );
            // }
            // svg.call(zoom);
            
        }
    }
}
</script>
<style scoped>
.roseContainer {
    background-color: rgb(190, 190, 190);
    width: 100%;
    height: 100%;
}
</style>