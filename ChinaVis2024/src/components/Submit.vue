<template>
    <div class="header">Submit View</div>
    <div class="list-container">
        <a-list size="large" bordered :data-source="stu_IDs">
            <template #renderItem="{ item }">
                <a-list-item>
                    <RoseOfStu :id="item" :dataobj="findObjectByID(item)"/>
                </a-list-item>
            </template>
        </a-list>
    </div>
    <p>这里放一个时间轴</p>
</template>

<script>    
import Rosedata from '../../public/data/Rosedata.json'
import RoseOfStu from '@/components/sub_components/RoseOfStu.vue'
export default {
    data() {
        return {
            stu_IDs:["8b6d1125760bd3939b6e", "63eef37311aaac915a45", "8b6d1125760bd3939b6e", "63eef37311aaac915a45", "8b6d1125760bd3939b6e", "63eef37311aaac915a45"],//需要绘制的学生ID
        };
    },
    mounted() {
        
    },
    methods: {
        findObjectByID(id) {
            const obj = Rosedata.find(item => item.student_ID === id);
            return obj;
        }
    },
}
</script>
<style scoped>
.list-container {
  height: 80%;
  width: 100%; 
  overflow: auto; 
}
.header{
    /* text-align: center; */
    font-size: 15px;
    font-weight: 600;
    color: #000000;
    background-color: #cfcfcf;
}
</style>