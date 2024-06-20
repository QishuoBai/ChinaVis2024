<template>
  <div ref="container" class="h-100 w-100 pa-2 d-flex flex-column">
    <div class="text-body-1 font-weight-bold">Week View</div>
    <v-divider></v-divider>
    <div
      ref="sub_container"
      class="flex-grow-1"
      style="overflow: scroll; height: 0px; "
    >
      <WeeksOfStu
        v-for="id in stu_IDs"
        :key="id"
        :dataobj="findObjectByID(id)"
      />
    </div>
  </div>
</template>
<script>
import WeeksOfStu from "@/components/sub_components/WeeksOfStu.vue";
import WeekRosedata from "../data/WeekRosedata.json";
import * as d3 from "d3";
export default {
  components: {
    WeeksOfStu,
  },
  data() {
    return {
      stu_IDs: [
        "8b6d1125760bd3939b6e",
        "63eef37311aaac915a45",
        "8b6d1125760bd3939b6e",
        "63eef37311aaac915a45",
        "8b6d1125760bd3939b6e",
        "63eef37311aaac915a45",
      ], //需要绘制的学生ID
    };
  },
  mounted() {
    
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
