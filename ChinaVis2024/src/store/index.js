import { defineStore } from "pinia";
import * as d3 from 'd3';

export const clusterStore = defineStore('cluster', {
    state: () => {
        return {
            result: [],
            selected_cluster: -1, // 0 是全选 , -1 表示这个不用了
            colors: d3.schemeCategory10,
            selected_students: [],
            selected_knowledge: "", // ""是全选
            features4cluster: [],
            hoverTitleInfo: {
                title:"default titleid",
                score:0.5,
                sbmnum:0.5
            },
        }
    },
})