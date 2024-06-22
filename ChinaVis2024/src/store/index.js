import { defineStore } from "pinia";
import * as d3 from 'd3';

export const clusterStore = defineStore('cluster', {
    state: () => {
        return {
            result: [],
            selected_cluster: -1, // 0 是全选 , -1 表示这个不用了
            // colors: ['#0079c3', '#f08300', '#00ada9'],
            colors: d3.schemeCategory10,
            selected_students: [],
            selected_knowledge: "", // ""是全选
            features4cluster: [],
            hoverTitleInfo: {
                show: false,
                title: null,
                score: null,
                sbmnum: null
            },
        }
    },
})