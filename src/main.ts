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
app.use(ElementPlus, {
    locale: zhCn,
});

// 挂载路由系统
app.use(router);  // pages/router.ts
app.config.performance = true;  // 开启性能追踪（生产环境建议关闭）

// 将应用挂载到#app容器
app.mount('#app');

// 扩展Window类型声明（TypeScript全局补丁）
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
