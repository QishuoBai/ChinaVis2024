<template>
  <div class="d-flex flex-column h-screen w-screen bg-grey-lighten-2">
    <div id="header" class="border-b-thin pa-1 px-3 bg-grey-darken-4 d-flex flex-row justify-space-between align-center">
      <div class="text-h6">时序多变量教育数据可视分析系统</div>
      <div class="d-flex flex-row">
        <div>Class:</div>
        <div></div>
      </div>
    </div>
    <div class="flex-grow-1 d-flex flex-row w-100">
        <!-- <div class="w-25 d-flex flex-column ma-1">
            <div class="h-50 w-100 mb-1 bg-white rounded">
                <Scatter />
            </div>
            <div class="h-50 w-100 bg-white rounded">
                <Portrait />
            </div>
        </div>
        <div class="flex-grow-1 d-flex flex-column ma-1 ml-0" style="width: 0px;">
            <div style="height: 60%;" class="mb-1 bg-white rounded">
                <WeekView />
            </div>
            <div style="height: 40%;" class="bg-white rounded">
                <TitleView />
            </div>
        </div> -->
        <div style="width: 80%;" class="d-flex flex-column ma-1">
            <div class="w-100 d-flex flex-row mb-0" style="height: 40%;">
                <div class="w-25 bg-white rounded"><Scatter /></div>
                <div class="flex-grow-1 ml-1 bg-white rounded"><Portrait /></div>
            </div>
            <div class="flex-grow-1 d-flex flex-row mt-1">
                <div class="w-50 h-100 mb-1 bg-white rounded"><TitleView /></div>
                <div class="w-50 h-100 mb-1 ml-1 bg-white rounded"><WeekView /></div>
            </div>
        </div>
        <div class="flex-grow-1 bg-white rounded ma-1 ml-0"></div>
    </div>
  </div>
</template>

<script>
//
import WeekView from './components/WeekView.vue';
import Scatter from './components/Scatter.vue';
import Portrait from './components/Portrait.vue';
import TitleView from './components/TitleView.vue';

export default {
    components:{
        WeekView,Scatter,Portrait,TitleView
    },
    data(){
        return{
            classes: ["All", ...Array.from({ length: 15 }, (_, i) => `Class${i + 1}`)],
            majors: ["All", "J23517", "J40192", "J57489", "J78901", "J87654"],
        }
    }
}
</script>
<style scoped>

</style>
