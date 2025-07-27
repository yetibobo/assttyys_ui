// 实现了一个简单的 HTTP 通信工具，专门用于与后端 API 进行 POST 请求通信。
// 核心功能
// HTTP POST 请求封装
// 该文件导出了一个 doPost 函数，它是一个异步函数，用于向后端发送 POST 请求：
// 
// URL 构建：将传入的相对路径与配置中的 remoteBackendAddr 拼接成完整的请求 URL
// CORS 支持：设置了 mode: 'cors' 以支持跨域请求
// JSON 通信：自动设置 Content-Type: application/json 头部，并将请求数据序列化为 JSON
// 响应处理：自动解析响应的 JSON 数据并返回
// 在认证系统中的应用
// 这个工具主要在 GitHub OAuth 认证流程中被使用。在 OauthGithub.vue 中，doPost 函数被用来验证用户的认证状态： OauthGithub.vue:31-34
// const getUserInfo = async () => {
//     const deviceId = await AutoWeb.autoPromise('getDeviceId');
//     return await doPost('/oauth/get_user_info', { deviceId });
// }
// const resumeValidUser = async () => {
//     const userInfo = await getUserInfo();
//     if (userInfo.error) {
//         ElMessage.error(`登录验证失败，请尝试重新登录`);
//         return;
//     }
//     ElMessage.success(`登录验证成功。`)
//     sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
//     router.replace('/SchemeManagementPage');
//     window.resumeValidUser = null;
// }
// 具体的使用场景是在用户完成 GitHub OAuth 后，前端通过设备 ID 向后端查询用户信息来验证登录状态。

// 配置依赖
// 该工具依赖于 config.ts 中的 remoteBackendAddr 配置，这个配置定义了后端服务的基础地址，支持开发环境和生产环境的不同配置。
// Notes
// src/tools/remote.ts 是一个专门为认证系统设计的轻量级 HTTP 客户端工具。虽然功能简单，但它为前端与后端的 OAuth 认证通信提供了必要的基础设施。
// 这个工具体现了项目中前后端分离的架构设计，通过标准的 HTTP API 进行数据交换。

import { remoteBackendAddr } from '../config';

export const doPost = async (url: string, data: any) => {
    const res = await fetch(`${remoteBackendAddr}${url}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await res.json();
}

