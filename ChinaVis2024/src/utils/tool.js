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

/**
* 调整十六进制颜色的透明度，输出保持不透明度的颜色
* @param {string} hex - 六位十六进制颜色字符串，例如 "#RRGGBB"
* @param {number} opacity - 透明度值，范围为 0.0 到 1.0
* @return {string} 调整后的六位十六进制颜色字符串
*/
export function adjustHexOpacity(hex, opacity) {
   // 去掉十六进制颜色的 # 前缀
   let hexWithoutHash = hex.replace('#', '');

   // 确保输入的是六位十六进制颜色
   if (hexWithoutHash.length !== 6) {
       throw new Error('Invalid hex color. It should be a 6-character hex string.');
   }

   // 解析红、绿、蓝颜色分量
   let r = parseInt(hexWithoutHash.substring(0, 2), 16);
   let g = parseInt(hexWithoutHash.substring(2, 4), 16);
   let b = parseInt(hexWithoutHash.substring(4, 6), 16);

   // 计算新的颜色分量，保持不透明度
   r = Math.round(r + (255 - r) * (1 - opacity));
   g = Math.round(g + (255 - g) * (1 - opacity));
   b = Math.round(b + (255 - b) * (1 - opacity));

   // 将新的颜色分量转换回十六进制
   let newHex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

   return newHex;
}