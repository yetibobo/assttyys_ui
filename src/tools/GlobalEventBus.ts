// -----------------前端消息中转站----------------
// 用来在SchemeManagementPage前端页面 中监听这些事件来刷新数据

// 1. 事件类型定义
// 该文件定义了两种主要的事件类型：
// 方案卡片操作事件 (Event.SchemeItemCard.Operation)：用于通知其他模块方案数据的变更
// 方案管理页面配置更新事件 (Event.SchemeManagementPage.configUpdate)：用于配置变更通知 GlobalEventBus.ts:4-16
// 2. 事件发射器创建
// 使用 mitt 库创建类型安全的事件发射器实例： GlobalEventBus.ts:18-20

// 在项目中的使用
// 事件发射
// 在 SchemeItemCard 组件中，各种操作会发射事件通知其他组件：

// 置顶操作： SchemeItemCard.vue:30-34
// 复制/修改操作： SchemeItemCard.vue:64-68
// 删除操作： SchemeItemCard.vue:88-91
// 事件监听
// 在 SchemeManagementPage 中监听这些事件来刷新数据： SchemeManagementPage.vue:130-132
    // globalEmmiter.on('Event.SchemeItemCard.Operation', (option) => {
    //     loadData();
    // });
// 在 FixedCollapse 组件中监听配置更新事件： FixedCollapse.vue:61-63
    // globalEmmiter.on('Event.SchemeManagementPage.configUpdate', (config: SchemePageConfig) => {
    //     scrollSettle.value = !!config.scrollSettle;
    // });
// 导入对话框中的使用
// 在 ImportSchemeDialog 中也使用事件总线来通知主界面刷新数据： ImportSchemeDialog.vue:50
// globalEmmiter.emit('Event.SchemeItemCard.Operation'); // 仅用于主界面刷新下数据

import mitt from 'mitt';
import type { GroupSchemeName, Scheme, SchemePageConfig } from './declares';

type Events = {
    // scheme卡片的操作事件，主要用于通知其它模块如方案管理页对展示数据进行更新
    'Event.SchemeItemCard.Operation': {
        type: 'copy' | 'modify' | 'remove',
        targetScheme: Scheme,
        newScheme?: Scheme, // copy/modify/toTop操作时会返回一个新对象出来
    } | {
        type: 'reSort',
        targetScheme: Scheme,
        groupSchemeNames: GroupSchemeName[],
    },
    'Event.SchemeManagementPage.configUpdate': SchemePageConfig, // 配置更新事件
};

const emitter = mitt<Events>();

export default emitter;
