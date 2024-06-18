<template>
    <div class="h-100 w-100 pa-2 d-flex flex-column">
        <div class="text-body-1 font-weight-bold">Portrait View</div>
        <v-divider></v-divider>
    </div>
  </template>
  
  <script>
  import stu_features from "@/data/stu_features.json";
  import * as d3 from "d3";
  
  export default {
    data() {
      return {
       
      };
    },
    computed: {},
    mounted() {
      this.init_portrait();
    },
    methods: {
        init_portrait() {
        // const svg_height = this.$refs.svg_container.clientHeight;
        // const svg_width = this.$refs.svg_container.clientWidth;
  
        // const svg = d3
        //   .select(this.$refs.svg_container)
        //   .append("svg")
        //   .attr("viewBox", `0 0 ${svg_width} ${svg_height}`)
        //   .attr("width", svg_width)
        //   .attr("height", svg_height);
        
      },
    },
  };
  </script>
  <style scoped>

  </style>
  