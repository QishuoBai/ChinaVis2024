import axios from "axios";

const api_base = "http://127.0.0.1:5000";

export async function postRequest(api_suffix, post_data) {
    try {
        // 使用 axios 发送 POST 请求
        const response = await axios.post(api_base + api_suffix, post_data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        // response.data 是服务器返回的数据
        console.log('成功: ', api_suffix, response);
        return response;
    } catch (error) {
        console.log('失败: ', api_suffix, error);
        return error.response;
    }
}

export async function getRequest(api_suffix){
    try {
        // 使用 axios 发送 POST 请求
        const response = await axios.get(api_base + api_suffix);
        // response.data 是服务器返回的数据
        console.log('成功: ', api_suffix, response);
        return response;
    } catch (error) {
        console.log('失败: ', api_suffix, error);
        return error.response;
    }
}