<template>
  <div class="d-flex flex-column h-screen w-screen">
    <div id="header" class="border-b-thin text-h6 pa-1 pl-3">
      时序多变量教育数据可视分析系统
    </div>
    <div class="flex-grow-1 d-flex flex-column w-100">
      <div class="h-50 d-flex flex-row">
        <div id="ClusterView" style="width:30%" class="border-thin"></div>
        <div id="SubmitView" class="flex-grow-1 border-sm">
          <WeekView />
        </div>
      </div>
      <div class="h-50 d-flex flex-row">
        <div id="PortraitView" style="width:30%" class="border-sm"></div>
        <div id="TitleView" class="flex-grow-1 border-sm">
          <TitleView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
//
</script>
<style scoped>

</style>
