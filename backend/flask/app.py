# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
import numpy as np

app = Flask(__name__)

CORS(app)

stu_features = pd.read_csv('../人题数据/stu_features.csv')

# 主页路由
@app.route('/hello')
def home():
    return "Welcome to the Flask API Demo!"

def choose_perplexity(n_samples, min_perplexity=5, max_perplexity=50):
    """
    根据样本数动态调整 perplexity 值。
    :param n_samples: 样本数量
    :param min_perplexity: 最小 perplexity 值
    :param max_perplexity: 最大 perplexity 值
    :return: 合适的 perplexity 值
    """
    if n_samples < 1000:
        return min(max(min_perplexity, n_samples // 10), max_perplexity)
    elif n_samples < 10000:
        return min(max(min_perplexity, n_samples // 100), max_perplexity)
    else:
        return min(max(min_perplexity, n_samples // 200), max_perplexity)


# 聚类路由
@app.route('/cluster', methods=['POST'])
def cluster():
    config = request.get_json()
    # 过滤数据
    filtered_data = stu_features
    if config['class'] != 'All':
        filtered_data = filtered_data[filtered_data['class'] == config['class']]
    if config['major'] != 'All':
        filtered_data = filtered_data[filtered_data['major'] == config['major']]
    features4cluster = []
    for feat in config['features']:
        if feat['use4cluster']:
            features4cluster.append(feat['name'])
        filtered_data = filtered_data[(filtered_data[feat['name']] >= feat['range'][0]) & (filtered_data[feat['name']] <= feat['range'][1])]
    data = filtered_data.copy()
    # 标准化数值特征
    scaler = StandardScaler()
    data[features4cluster] = scaler.fit_transform(data[features4cluster])
    # 使用 K-Means 进行聚类
    data_for_clustering = data[features4cluster].values.astype(object)
    kmeans = KMeans(n_clusters=3, random_state=42)
    clusters = kmeans.fit_predict(data_for_clustering)
    data['cluster'] = clusters
    # 降维
    # 进行 PCA 降维到 2 维
    tsne = TSNE(n_components=2, random_state=42, perplexity=choose_perplexity(data.shape[0]))
    tsne_results = tsne.fit_transform(data[features4cluster])
    tsne_df = pd.DataFrame(tsne_results, columns=['x', 'y'])
    data['x'] = tsne_df['x'].values
    data['y'] = tsne_df['y'].values
    return data[['student_ID', 'x', 'y', 'cluster']].to_json(orient='records'), 201


# 启动应用
if __name__ == '__main__':
    app.run(debug=True)
