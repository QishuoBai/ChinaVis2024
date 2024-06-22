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
    <v-expand-x-transition><v-card id="TitleTooltip" class="elevation-5 border-thin rounded-lg" v-show="Info_Tooltip.show" style="
        height: 120px;
        width: auto;
        position: absolute;
      ">
        <v-card-title
          >
          <v-chip >
            {{ this.Info_Tooltip.title }}
          </v-chip>
          </v-card-title
        >
        <v-card-text class="text-body-2 mt-2 mb-0 text-no-wrap"
          >
            <div class="d-flex flex-row">
              <div class="w-50">Avg. Score:</div><div>{{ this.Info_Tooltip.score }}</div>
            </div>
            <div class="d-flex flex-row mt-1">
              <div class="w-50">Avg. Submit Num:</div><div>{{ this.Info_Tooltip.sbmnum }}</div>
            </div>
            </v-card-text
        >
      </v-card></v-expand-x-transition>
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
