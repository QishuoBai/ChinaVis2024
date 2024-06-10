import pandas as pd
import os

# 定义学生信息和班级提交记录的文件路径
student_info_path = 'data/数据/Data_StudentInfo.csv'
submit_record_dir = 'data/数据/Data_SubmitRecord/'
output_dir = 'output_excels/'

# 创建输出目录
os.makedirs(output_dir, exist_ok=True)

# 读取学生信息
student_info_df = pd.read_csv(student_info_path)

# 获取所有班级的提交记录文件名
submit_record_files = [f for f in os.listdir(submit_record_dir) if f.endswith('.csv')]

# 创建一个字典来存储每个班级的提交记录数据
class_records = {}

# 读取每个班级的提交记录文件并存储数据
for file in submit_record_files:
    class_name = file.split('-')[1].split('.')[0]  # 获取班级名称
    class_number = int(class_name.replace('Class', ''))  # 提取班级号并转换为整数
    submit_record_df = pd.read_csv(os.path.join(submit_record_dir, file))
    submit_record_df['timeconsume'] = pd.to_numeric(submit_record_df['timeconsume'].replace('--', pd.NA), errors='coerce')
    if class_number not in class_records:
        class_records[class_number] = submit_record_df
    else:
        class_records[class_number] = pd.concat([class_records[class_number], submit_record_df])

# 按班级号排序
sorted_class_records = dict(sorted(class_records.items()))

# 统计和保存每个班级的答题特征到 Excel
for class_number, record_df in sorted_class_records.items():
    print(f"\nClass: Class{class_number}")
    
    # 作答表现特征
    student_scores = record_df.groupby('student_ID')['score']
    s_mean_score = student_scores.mean()
    s_var_score = student_scores.var()
    
    # 做题习惯特征
    student_submissions = record_df.groupby('student_ID').size()
    s_mean_subNum = student_submissions.mean()
    
    student_methods = record_df.groupby('student_ID')['method'].nunique()
    s_method_num = student_methods.mean()
    
    # 偏好答题时段
    total_duration = record_df['time'].max() - record_df['time'].min()
    record_df['relative_time'] = (record_df['time'] - record_df['time'].min()) / total_duration
    s_usual_time = record_df.groupby('student_ID')['relative_time'].mean()
    
    # 合并所有特征数据
    feature_df = pd.DataFrame({
        'Mean Score': s_mean_score,
        'Score Variance': s_var_score,
        'Mean Submissions': student_submissions,
        'Method Variety': student_methods,
        'Usual Time': s_usual_time
    })
    
    # 保存为 Excel 文件
    feature_df.to_excel(os.path.join(output_dir, f'Class{class_number}_features.xlsx'), index=True)

    print(f"Class{class_number} features saved to {output_dir}")
