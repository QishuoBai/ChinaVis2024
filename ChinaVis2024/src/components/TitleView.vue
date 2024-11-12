<template>
  <div class="h-100 w-100 pa-2 d-flex flex-column">
    <div
      class="text-body-1 font-weight-bold d-flex flex-row justify-space-between"
    >
      <div>Question View</div>
      <div class="d-flex flex-row align-center text-body-2 font-weight-bold">
        <div>Knowledges:</div>
        <div class="ml-2">
          {{ SelectedKnowledge == "" ? "All" : SelectedKnowledge }}
        </div>
        <v-btn
          class="ml-4 text-body-2 font-weight-bold"
          variant="text"
          size="x-small"
          :append-icon="ascending ? 'mdi-arrow-up' : 'mdi-arrow-down'"
          @click="ascending = !ascending"
          >Difficulty Order
        </v-btn>
      </div>
    </div>
    <v-divider></v-divider>
    <div
      class="flex-grow-1 overflow-scroll overflow-x-auto"
      style="height: 0px"
    >
      <div class="TitlesContainer w-100 h-100">
        <v-list lines="one">
          <v-list-item v-for="tid in this.TitleList" :key="tid">
            <RowOfTitle :dataobj="findObjectByTitleID(tid)"></RowOfTitle><v-divider></v-divider>
          </v-list-item>
          
        </v-list>
      </div>
    </div>
    <v-expand-x-transition
      ><v-card
        id="TitleTooltip"
        class="elevation-5 border-thin rounded-lg"
        v-show="Info_Tooltip.show"
        style="height: auto; width: auto; position: absolute; z-index: 999"
      >
        <v-card-title>
          <v-chip style="width: 250px;" class="d-flex flex-row align-center justify-center">
            {{ this.Info_Tooltip.title }}
          </v-chip>
        </v-card-title>
        <v-card-text class="text-body-2 mt-2 mb-0 text-no-wrap">
          <div class="d-flex flex-row mt-1">
            <div class="w-50">Difficulty:</div>
            <div>{{ this.Info_Tooltip.difficulty }}</div>
          </div>
          <div class="d-flex flex-row mt-1">
            <div class="w-50">Avg. Score:</div>
            <div>{{ this.Info_Tooltip.score }}</div>
          </div>
          <div class="d-flex flex-row mt-1">
            <div class="w-50">Avg. Submit Num:</div>
            <div>{{ this.Info_Tooltip.sbmnum }}</div>
          </div>
        </v-card-text>
      </v-card></v-expand-x-transition
    >
  </div>
</template>
<script>
import TitleViewData from "@/data/title_view_data.json";
import RowOfTitle from "@/components/sub_components/RowOfTitle.vue";
import { clusterStore } from "@/store";
import { knowledge2Titles, AllTitleList, TitleListSorted } from "@/utils/asset";
export default {
  components: {
    RowOfTitle,
  },
  data() {
    return {
      TitleList: [],
      ascending: true,
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
      if (clusterStore().selected_knowledge == "") {
        this.TitleList = TitleListSorted(AllTitleList, this.ascending);
      } else {
        const listObj = knowledge2Titles.find(
          (obj) => obj.knowledge === this.SelectedKnowledge
        );
        this.TitleList = TitleListSorted(listObj.titleArr, this.ascending);
      }
    },
    ascending() {
      this.TitleList = TitleListSorted(this.TitleList, this.ascending);
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
