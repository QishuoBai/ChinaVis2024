<template>
  <div class="d-flex flex-column h-screen w-screen bg-grey-lighten-2">
    <div id="header" class="border-b-thin text-h6 pa-1 pl-3 bg-grey-darken-4">
      时序多变量教育数据可视分析系统
    </div>
    <div class="flex-grow-1 d-flex flex-row w-100">
        <div class="w-25 d-flex flex-column ma-1">
            <div class="h-50 w-100 mb-1 bg-white rounded">
                <Scatter />
            </div>
            <div class="h-50 w-100 bg-white rounded">
                <Portrait />
            </div>
        </div>
        <div class="flex-grow-1 d-flex ma-1 ml-0 flex-column">
            <div style="height: 60%;" class="mb-1 bg-white rounded">
                <Submit />
            </div>
            <div class="flex-grow-1 bg-white rounded"></div>
        </div>
    </div>
  </div>
</template>

<script setup>
//
import Submit from './components/Submit.vue';
import Scatter from './components/Scatter.vue';
import Portrait from './components/Portrait.vue';
</script>
<style scoped>

</style>
