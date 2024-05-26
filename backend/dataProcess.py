import pandas as pd
import os
from tqdm import tqdm
titlePath = '../dataset/Data_TitleInfo.csv'
studentPath = '../dataset/Data_StudentInfo.csv'
submitPath = '../dataset/Data_SubmitRecord'


def getTitle():
    title = pd.read_csv(titlePath)
    return title.drop(columns=['index'])


def getStudent():
    student = pd.read_csv(studentPath)
    return student.drop(columns=['index'])


def getSubmit(classId=1):
    submit = pd.read_csv(os.path.join(submitPath, 'SubmitRecord-Class' + str(classId) + '.csv'))
    return submit.drop(columns=['index'])


def getAllSubmit():
    submitRecords = []
    for i in range(1, 16):
        submitRecords.append(getSubmit(i))
    return pd.concat(submitRecords)




def genAllData():
    '''
    unfinished
    合并数据集行数会增加（没想明白）
    :return:
    '''
    title = getTitle()
    student = getStudent()
    submit = getAllSubmit()
    print(submit.shape)
    print(submit.drop_duplicates().shape)
    print(pd.merge(submit, student, on='student_ID').shape)
    print(pd.merge(pd.merge(submit, student, on='student_ID'), title, on='title_ID').shape)
    print(pd.merge(pd.merge(submit, title, on='title_ID',how='left'), student, on='student_ID',how='left').shape)

    return pd.merge(pd.merge(submit, student, on='student_ID'), title, on='title_ID')


def genStudentTitleData():
    '''
    计算人-题数据特征
    :return:
    '''
    df = getAllSubmit()
    students = df['student_ID'].unique()
    titles = df['title_ID'].unique()
    #print(df[df.duplicated(subset=['student_ID', 'title_ID','time'],keep=False)].sort_values(by=['student_ID',

    newDf = pd.DataFrame(columns=['student_ID', 'title_ID', 'st_max_score', 'st_pfm_tc','st_pfm_mem','st_tt_subNum',
                                  'st_tt_period','st_fm_subNum','st_fm_period','st_errs','st_exploreNum'])
    for student in tqdm(students):
        for title in titles:
            studentTitle = df[(df['student_ID'] == student) & (df['title_ID'] == title)]
            if studentTitle.empty:
                continue
            max_score=studentTitle['score'].max()
            tt_subNum = studentTitle.shape[0]
            tt_period = studentTitle['time'].max() - studentTitle['time'].min()
            fm_time= studentTitle[studentTitle['score'] == max_score]['time'].min()
            pfm_tc= studentTitle[studentTitle['score'] == max_score]['timeconsume'].min()
            pfm_mem= studentTitle[studentTitle['score'] == max_score]['memory'].min()
            fm_subNum = studentTitle[studentTitle['time'] < fm_time].shape[0]
            fm_period = fm_time - studentTitle['time'].min()
            st_errs = list(studentTitle[studentTitle['state'] != 'Absolutely_Correct']['state'].unique())
            ac_time= studentTitle[studentTitle['state'] == 'Absolutely_Correct']['time'].min()
            st_exploreNum = studentTitle[studentTitle['time'] < ac_time].shape[0]
            newDf = pd.concat([newDf,pd.DataFrame([{'student_ID':student,'title_ID':title,'st_max_score':max_score,
                                       'st_pfm_tc':pfm_tc,
                                   'st_pfm_mem':pfm_mem,'st_tt_subNum':tt_subNum,'st_tt_period':tt_period,
                                   'st_fm_subNum':fm_subNum,'st_fm_period':fm_period,'st_errs':';'.join(st_errs),
                                  'st_exploreNum':st_exploreNum
                              }])],ignore_index=False)
    newDf.to_csv('../dataset/Data_StudentTitleInfo.csv',index=False)
    return newDf
if __name__ == '__main__':
    genStudentTitleData()