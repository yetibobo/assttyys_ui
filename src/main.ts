import './assets/main.css';

import { createApp } from 'vue';  // 导入Vue核心API和组件库
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'  // 中文语言包
import 'element-plus/dist/index.css';  // ElementPlus样式

// 导入应用组件和路由模块
import App from './App.vue';
import router from './pages/router';
import { AutoWeb } from './tools/AutoWeb'; // 自定义工具类

// 创建Vue应用实例
const app = createApp(App);

// 配置ElementPlus组件库（含中文支持）
// app.use 是 Vue 框架的运行时 API
// 主要用于安装插件（如 Vue Router、Vuex）或扩展全局功能
// app.use()安装一个插件。

// ---社区插件ElementPlus 详见https://cn.element-plus.org/zh-CN/
app.use(ElementPlus, {
    locale: zhCn,
});

// 挂载路由系统---官方插件Vue-Router 详见https://router.vuejs.org/zh/
app.use(router);  // pages/router.ts
app.config.performance = true;  // 开启性能追踪（生产环境建议关闭）

// 将应用挂载到#app容器
app.mount('#app');

// 扩展Window类型声明（TypeScript全局补丁）
// 这段代码通过 TypeScript 的 declare global 扩展了全局 Window 接口，向浏览器环境添加了四个自定义属性/方法：
// ‌routeBack: () => void‌
// 声明了一个无返回值、可调用的函数方法，通常用于实现页面回退逻辑（如返回上一页或历史记录）‌
// ‌routeBackFlag: boolean‌
// 声明了一个布尔值属性，可能用于标记是否允许回退操作的状态‌
// ‌loadScheduleData: Function‌
// 声明了一个函数方法，可能用于异步加载调度数据（如定时任务或计划表）‌
// ‌resumeValidUser: Function‌
// 声明了一个函数方法，可能用于恢复用户会话有效性（如重新验证登录状态

//*推荐优先用 declare global‌：扩展 Window 等全局对象时更直观、类型安全，
// 而extend 更适合继承类型‌：如自定义类扩展原生类型时使用‌.无法直接扩展 Window 这类全局对象,对复杂方法（如函数链式调用）支持较弱

declare global {
    interface Window {
        routeBack: () => void; // 返回方法
        routeBackFlag: boolean;// 返回状态标记
        loadScheduleData: Function; // 数据加载方法
        resumeValidUser: Function;// 用户恢复方法
    }
}

// 全局返回按钮处理逻辑
window.routeBack = function () {
    // if (window.history.state.back) {
    //     router.back();

    // 排除特定页面（SchemeManagementPage）且存在历史记录时直接返回
    if (!(router.currentRoute.value.name as string).includes('SchemeManagementPage') && window.history.state.back) {
        router.back();
    } else {
        // 双按退出保护机制
        if (window.routeBackFlag) {
            AutoWeb.autoPromise('exit');// 执行退出操作
        } else {
            window.routeBackFlag = true;
            AutoWeb.autoPromise('toast', '再按一次退出程序');
            setTimeout(() => {
                window.routeBackFlag = false; // 重置状态
            }, 1500) // 1.5秒超时
        }
    }
}
