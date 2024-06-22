<template>
  <div class="h-100 w-100 pa-2 d-flex flex-column">
    <div class="text-body-1 font-weight-bold">Title View</div>
    <v-divider></v-divider>
    <div
      class="flex-grow-1 overflow-scroll overflow-x-auto hide-scrollbar"
      style="height: 0px"
    >
      <div class="TitlesContainer w-100 h-100">
        <v-list lines="one">
          <v-list-item v-for="tid in this.TitleList" :key="tid">
            <v-card variant="outlined">
              <RowOfTitle :dataobj="findObjectByTitleID(tid)"></RowOfTitle>
            </v-card>
          </v-list-item>
        </v-list>
      </div>
    </div>
    <div
      id="TitleTooltip"
      style="height: 200px; width: 400px; position: absolute; left: 200px; display: none;"
    >
      <v-card>
        <template v-slot:title class="text-h5">{{this.Info_Tooltip.title}}</template>
        <div class="d-flex flex-column py-0 justify-space-around text-body-2">
          <v-list-item>
            <p>mean_score:{{this.Info_Tooltip.score}}</p>
          </v-list-item>
          <v-list-item>
            <p>mean_sbmnum:{{this.Info_Tooltip.sbmnum}}</p>
          </v-list-item>
        </div>
      </v-card>
    </div>
  </div>
</template>
<script>
import * as d3 from "d3";
import TitleViewData from "../data/TitleViewData2.json";
import RowOfTitle from "@/components/sub_components/RowOfTitle.vue";
import { clusterStore } from "@/store";
import { knowledge2Titles } from "@/utils/asset";
export default {
  data() {
    return {
      TitleList: [
        "Question_BW0ItEaymH3TkD6S15JF",
        "Question_5fgqjSBwTPG7KUV3it6O",
        "Question_X3wF8QlTyi4mZkDp9Kae",
        "Question_YWXHr4G6Cl7bEm9iF2kQ",
      ],
    };
  },
  computed: {
    SelectedKnowledge() {
      return clusterStore().selected_knowledge;
    },
    Info_Tooltip() {
      return clusterStore().hoverTitleInfo;
    },
  },
  watch: {
    SelectedKnowledge() {
      const listObj = knowledge2Titles.find(
        (obj) => obj.knowledge === this.SelectedKnowledge
      );
      this.TitleList = listObj.titleArr;
    },
  },
  methods: {
    findObjectByTitleID(tid) {
      const obj = TitleViewData.find((item) => item.title_ID === tid);
      return obj;
    },
  },
};
</script>
