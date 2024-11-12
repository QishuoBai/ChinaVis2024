import student_view_data from "@/data/student_view_data.json";
import { c } from "naive-ui";
import { keysOf } from "naive-ui/es/_utils";

const knowledgeOrder = {
    group: [],
    array: [],
    Radian: []
};
const ks = keysOf(student_view_data.knowledges);
ks.forEach((k) => {
    knowledgeOrder.group.push(keysOf(student_view_data.knowledges[k]));
    keysOf(student_view_data.knowledges[k]).forEach((sk) => {
        knowledgeOrder.array.push(sk);
    });
});
let radian = 0;
knowledgeOrder.group.forEach((g) => {
    g.forEach((knowledge) => {
        knowledgeOrder.Radian.push({
            sa: radian,
            ea: radian + (2 * Math.PI) / knowledgeOrder.group.length / g.length,
        });
        radian += (2 * Math.PI) / knowledgeOrder.group.length / g.length;
    });
});
const knowledge2Titles = [];
ks.forEach((k) => {
    let titleArr = [];
    keysOf(student_view_data.knowledges[k]).forEach((sk) => {
        titleArr = [...titleArr, ...student_view_data.knowledges[k][sk]]
    });
    knowledge2Titles.push({
        knowledge: k,
        titleArr: titleArr
    });
});

const AllTitleList = [];
knowledge2Titles.forEach((k) => {
    AllTitleList.push(...k.titleArr);
});

const subknowledgeCount = [];
ks.forEach((k) => {
    keysOf(student_view_data.knowledges[k]).forEach((sk) => {
        subknowledgeCount.push({
            name: sk,
            num: student_view_data.knowledges[k][sk].length
        });
    });
});
const knowledgeCount = [];
ks.forEach((k) => {
    let num = 0;
    keysOf(student_view_data.knowledges[k]).forEach((sk) => {
        num += student_view_data.knowledges[k][sk].length;
    });
    knowledgeCount.push({
        name: k,
        num: num
    });
});

// 题目难度表，不精确，仅用于排序
const DifTable = [];

import title_view_data from "@/data/title_view_data.json";
title_view_data.forEach((t) => {
    DifTable.push({
        TitleId: t.title_ID,
        Difficulty: t.t_difficulty
    });
});
DifTable.sort((t1, t2) => t2.Difficulty - t1.Difficulty);
console.log(DifTable);

const TitleListSorted = (list, ascending = true) => {

    if (list.length <= 1) return list;
    const findDif = (tid) => {
        return DifTable.find((obj) => obj.TitleId === tid).Difficulty;
    };
    list.sort((t1, t2) => {
        if (ascending) return findDif(t1) - findDif(t2);
        else return findDif(t2) - findDif(t1);
    });

    return list;
};
export {
    ks,
    knowledgeOrder,
    knowledge2Titles,
    subknowledgeCount,
    knowledgeCount,
    AllTitleList,
    TitleListSorted,
    DifTable
};
