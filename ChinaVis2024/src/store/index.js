import { defineStore } from "pinia";
import * as d3 from 'd3';

export const clusterStore = defineStore('cluster', {
    state: () => {
        return {
            result: [],
            selected_cluster: 0,
            colors: d3.schemeCategory10,
            selected_students: [],
            selected_knowledge: "",
        }
    },
})