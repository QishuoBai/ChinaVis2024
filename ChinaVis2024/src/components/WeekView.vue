<template>
  <div ref="container" class="h-100 w-100 pa-2 d-flex flex-column">
    <div class="text-body-1 font-weight-bold">Week View</div>
    <v-divider></v-divider>

    <div class="flex-grow-1" style="overflow: scroll; height: 0px">
      <div style="width: 2300px">
        <div class="StudentsContainer h-100">
          <v-toolbar style="margin-left: 80px" color="#eee" class="position-relative top-0">
            <span v-for="wk in 22" style="width: 100px">
              <v-chip label color="blue" class="mx-2">Week{{ wk }}</v-chip>
            </span>
          </v-toolbar>
          <v-list lines="one">
            <v-list-item
              v-for="id in this.stu_IDs"
              :key="id"
              prepend-icon="mdi-account-circle"
            >
              <v-card variant="outlined">
                <div style="height: 100px">
                  <RowRoseOfStu :dataobj="findObjectByID(id)"></RowRoseOfStu>
                </div>
              </v-card>
            </v-list-item>
          </v-list>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RowRoseOfStu from "@/components/sub_components/RowRoseOfStu.vue";
import WeekRosedata from "../data/WeekRosedata.json";
import * as d3 from "d3";
export default {
  data() {
    return {
      //需要绘制的学生ID
      stu_IDs: [
        "8b6d1125760bd3939b6e",
        "63eef37311aaac915a45",
        "5d89810b20079366fcc2",
        "47eeab842793b09300c3",
        "a8eea517e36b20757b2e",
        "e89cdaa3f159a0d3f55e",
      ],
    };
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
