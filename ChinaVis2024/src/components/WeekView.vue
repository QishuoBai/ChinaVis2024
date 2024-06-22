<template>
  <div ref="container" class="h-100 w-100 pa-2 d-flex flex-column">
    <div class="text-body-1 font-weight-bold">Week View</div>
    <v-divider></v-divider>

    <div
      class="flex-grow-1 position-relative"
      style="overflow: scroll; height: 0px; z-index: 0"
    >
      <div class="h-100 position-absolute top-0 bg-white d-flex flex-row"  style="width: 2300px; z-index: 0;">
        <div :style="{ width: `${layout.user_icon_width}px` }"></div>
        <div v-for="wk in 22"
        :key="wk" :style="{ width: `${layout.item_width}px` ,backgroundColor: wk % 2 != 0 ? gray_color : '',}"></div>

      </div>
      <div style="width: 2300px;z-index: 1;">
        <div class="StudentsContainer h-100">
          <div class="d-flex flex-row position-sticky top-0" style="z-index: 99">
            <div :style="{ width: `${layout.user_icon_width}px` }"></div>
            <div
              v-for="wk in 22"
              :key="wk"
              :style="{
                width: `${layout.item_width}px`,
              }"
              class="d-flex flex-row justify-center align-center pt-1 font-weight-medium text-body-2"
            >
              Week{{ wk }}
            </div>
          </div>
          <div
            v-for="id in this.selected_students"
            :key="id"
            class="d-flex flex-row"
          >
            <div
              :style="{ width: `${layout.user_icon_width}px` }"
              class="d-flex flex-column justify-center align-center"
            >
              <v-icon icon="mdi-account-circle"></v-icon>
              <v-chip size="x-small" variant="outlined">{{id.slice(0, 5)}}</v-chip>
            </div>

            <div :style="{ height: `${layout.item_height}px`, zIndex:2}">
              <RowRoseOfStu
                :dataobj="findObjectByID(id)"
                :height="layout.item_height"
                :gray_color="gray_color"
              ></RowRoseOfStu>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RowRoseOfStu from "@/components/sub_components/RowRoseOfStu.vue";
import WeekRosedata from "@/data/week_view_data.json";
import * as d3 from "d3";
import { clusterStore } from "@/store";

export default {
  components: {
    RowRoseOfStu,
  },
  data() {
    return {
      //需要绘制的学生ID
      layout: {
        calender_height: 100,
        user_icon_width: 50,
        item_height: 100,
        item_width: 100,
      },
      gray_color: "#F5F5F5",
    };
  },
  computed: {
    selected_students() {
      return clusterStore().selected_students;
    },
  },
  methods: {
    findObjectByID(id) {
      const obj = WeekRosedata.find((item) => item.student_ID === id);
      return obj;
    },
  },
};
</script>
<style scoped></style>
