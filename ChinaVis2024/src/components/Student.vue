<template>
  <div class="h-100 w-100 pa-2 d-flex flex-column">
    <div class="text-body-1 font-weight-bold">Student View</div>
    <v-divider></v-divider>
    <div
      ref="container"
      class="w-100 h-100 pa-2 overflow-scroll overflow-x-auto hide-scrollbar"
    >
      <v-card v-for="(item, index) in selected_students_features" :key="index">
        <v-card-text>
          <div class="d-flex flex-row text-body-2 font-size-10 justify-space-between">
              <v-chip size="small">{{ item.student_ID }}</v-chip>
              <v-chip size="small">{{ item.class }}</v-chip>
              <v-chip size="small">{{ item.major }}</v-chip>
          </div>
          <div class="d-flex flex-row">
            <div class="w-50 text-center"></div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { knowledgeCount, subknowledgeCount } from "@/utils/asset";
import data from "@/data/student_view_data.json";
import { clusterStore } from "@/store";
import stu_features from "@/data/stu_features.json";

export default {
  data() {
    return {
      tmp_selected_stuids: ["0088dc183f73c83f763e", "00cbf05221bb479e66c3"],
    };
  },
  computed: {
    selected_students() {
      return clusterStore().selected_students;
    },
    selected_students_features() {
      return stu_features.filter((d) =>
        this.tmp_selected_stuids.includes(d.student_ID)
      );
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style>
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
