// 导入 Vue Router 的创建方法和路由组件
// 使用 Hash 模式的路由历史记录和创建路由方法:
import { createWebHashHistory, createRouter } from 'vue-router';

import SchemeManagementPage from './SchemeManagementPage.vue';  // 导入方案管理页面组件
import FunctionManagementPage from './FunctionManagementPage.vue';  // 导入功能管理页面组件
import SettingsPage from './SettingsPage.vue';  // 导入设置页面组件
import SchedulerPage from './SchedulerPage.vue';  // 导入定时任务页面组件
import OauthGithub from './OauthGithub.vue';  //导入 GitHub OAuth 认证页面组件
import Home from './Home.vue';  // 导入首页组件

// 定义路由规则数组
const routes = [
    { name: 'Home', path: '/', component: Home },   // 根路径映射到首页组件
    { name: 'SchemeManagementPage', path: '/SchemeManagementPage', component: SchemeManagementPage },
    { name: 'FunctionManagementPage', path: '/FunctionManagementPage', component: FunctionManagementPage },
    { name: 'SettingPage', path: '/SettingPage', component: SettingsPage },
    { name: 'SchedulerPage', path: '/SchedulerPage', component: SchedulerPage },
    { name: 'OAuth', path: '/OAuth', component: OauthGithub },
];

// 创建路由实例
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

// 定义路由菜单配置(用于导航显示)
const routesDefine = [
    // { name: 'ASSTTYYS' },
    { name: '方案管理', path: '/SchemeManagementPage' },
    { name: '定时任务', path: '/SchedulerPage' },
    { name: '设置', path: '/SettingPage' },
    // { name: '功能管理', parent: '方案管理', path: '/FunctionManagementPage' },
];

// 修改为使用外部浏览器进行登录认证，不使用内部登录
// 处理github回调过来时的登录认证
// if (window.location.href.includes('?code=')) {
//     const [_all, url, code] = window.location.href.match(/^(.+)\?code=([^&#]+)/);
//     // const code = window.location.href.split('?code=')[1];
//     sessionStorage.setItem('code', code);
//     // TODO 该方式会丢失context-path，如果是二级目录部署，或file://文件协议访问，该回跳的方式就会有问题
//     window.location.href = `${url}#/OAuth`;
//     // router.push('/OAuth');
// }


export { routesDefine };
export default router;
