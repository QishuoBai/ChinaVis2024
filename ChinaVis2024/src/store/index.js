import { defineStore } from "pinia";

export const clusterStore = defineStore('cluster', {
    state: () => {
        return {
            result: [],
        }
    },
})