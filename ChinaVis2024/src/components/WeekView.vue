<template>
    <div class="header">Week View</div>
    <div class="container">
        <WeeksOfStu v-for="(id, index) in stu_IDs" :dataobj="findObjectByID(id)"/>
    </div>
</template>
<script>
import WeeksOfStu from '@/components/sub_components/WeeksOfStu.vue'
import Rosedata2 from '../../public/data/Rosedata2.json'
export default {
    data() {
        return {
            stu_IDs:["8b6d1125760bd3939b6e", "63eef37311aaac915a45", "8b6d1125760bd3939b6e", "63eef37311aaac915a45", "8b6d1125760bd3939b6e", "63eef37311aaac915a45"],//需要绘制的学生ID
        };
    },
    mounted() {
        
    },
    methods: {
        draw_Stu(id){
            return
        },
        findObjectByID(id) {
            const obj = Rosedata2.find(item => item.student_ID === id);
            return obj;
        }
    },
}
</script>
<style scoped>
.container {
  height: 90%;
  /* 这里注意修改！ */
  width: 880px;
  overflow: scroll scroll;
}
.header{
    /* text-align: center; */
    font-size: 15px;
    font-weight: 600;
    color: #000000;
    background-color: #cfcfcf;
}
</style>