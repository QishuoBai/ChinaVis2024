<template>
    <div class="text-h6">Week View</div>
    <div class="container">
        <WeeksOfStu v-for="(id) in stu_IDs" :dataobj="findObjectByID(id)"/>
    </div>
</template>
<script>
import WeeksOfStu from '@/components/sub_components/WeeksOfStu.vue'
import WeekRosedata from '../../public/data/WeekRosedata.json'
export default {
    data() {
        return {
            stu_IDs:["8b6d1125760bd3939b6e", "63eef37311aaac915a45", "8b6d1125760bd3939b6e", "63eef37311aaac915a45", "8b6d1125760bd3939b6e", "63eef37311aaac915a45"],//需要绘制的学生ID
        };
    },
    methods: {
        findObjectByID(id) {
            const obj = WeekRosedata.find(item => item.student_ID === id);
            return obj;
        }
    },
}
</script>
<style scoped>
.container {
  height: 90%;
  /* 这里注意修改！ */
  width: 1200px;
  overflow: scroll scroll;
}
</style>