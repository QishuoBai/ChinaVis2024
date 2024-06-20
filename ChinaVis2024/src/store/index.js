import { defineStore } from "pinia";
import * as d3 from 'd3';

export const clusterStore = defineStore('cluster', {
    state: () => {
        return {
            result: [],
            selected: 0,
            colors: d3.schemeCategory10,
        }
    },
})