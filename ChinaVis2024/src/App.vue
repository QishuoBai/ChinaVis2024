<template>
  <div>
    <div id="header">
      <h3>时序多变量教育数据可视分析系统</h3>
    </div>
    <div style="width: 100vw;height: 45vh;">
      <div id="ClusterView"></div>
      <div id="SubmitView">
        <Submit />
      </div>
    </div>
    <div style="width: 100vw;height: 45vh;">
      <div id="PortraitView"></div>
      <div id="TitleView"></div>
    </div>
  </div>
</template>

<script setup>
  //
</script>
<style scoped>  
#header {
  /* background-color: "red"; */
  width: 100vw;
  height: 9vh;
  border: 1px solid #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
}
#ClusterView, #PortraitView{
  width: 30%;
  height: 100%;
  border: 1px solid #ddd;
  float: left;
}
#SubmitView, #TitleView {
  width: 70%;
  height: 100%;
  border: 1px solid #ddd;
  float: left;
}
</style>
