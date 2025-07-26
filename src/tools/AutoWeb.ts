import FullLoading from "@/components/DebouncedFullLoading"; // 防抖式全屏加载组件
import { type AutoWebTypes } from "./declares"; // 定义通信事件类型约束
import MockMethod from "./Mocks/MockMethod"; // 模拟数据生成工具
import { uuid } from "./tools"; // UUID生成工具

// 搞不定@auto.pro/web的编译毛病，直接copy过来了
let emit: any = prompt; // 声明全局通信方法变量


export const AutoWeb = {  // 定义全局通信工具
    setMode(mode: string) {    // 切换通信模式
        emit = (window as any)[mode] || prompt;    // 优先使用 window 对象方法，默认 fallback 到 prompt
    },
    devicelly(deviceFn: string, ngFn: Function, self: any, once = false) {    // 绑定回调到 window
        (window as any)[deviceFn] = (...option: any) => {     // 动态创建函数
            const result = ngFn.apply(self || this, option);    // 执行回调（支持 this 或指定上下文）
            if (once) {
                delete (window as any)[deviceFn];    // 一次性执行后清理
            }
            return result;    // 返回回调结果
        };
    },
    removeDevicelly(deviceFn: string) {    // 手动删除回调
        delete (window as any)[deviceFn];    // 清理 window 对象属性
    },
    auto<Key extends keyof AutoWebTypes>(eventname: Key, params?: AutoWebTypes[Key]['param'], callback?: (arg: AutoWebTypes[Key]['result']) => void) {    // 泛型通信方法
        if (callback) {    // 异步模式
            const EVENT_ID = eventname + uuid()    // 生成唯一事件ID
            this.devicelly(EVENT_ID, callback, this, true);    // 绑定回调（一次性）
            return emit(eventname, JSON.stringify({    // 发送带回调ID的请求
                params,
                PROMPT_CALLBACK: EVENT_ID
            }));
        }
        else {    // 同步模式
            return emit(eventname, JSON.stringify(params));    // 直接发送参数
        }
    },

    // Promise 封装
    autoPromise<Key extends keyof AutoWebTypes>(eventname: Key, params?: AutoWebTypes[Key]['param'], timeout = 30000): Promise<AutoWebTypes[Key]['result']> {
        FullLoading.show();    // 显示加载动画
        return new Promise((resolve, reject) => {    // 创建 Promise
            const tmid = setTimeout(() => {    // 设置超时
                reject(new Error('timeout'));    // 超时处理
                FullLoading.close();
            }, timeout);
            this.auto(eventname, params, (result: AutoWebTypes[Key]['result']) => {
                clearTimeout(tmid);
                resolve(result);
                FullLoading.close();     // 成功回调
            });
        })
    }
};


// // 调试模式
// localStorage.setItem('debug', '1');
if (localStorage.getItem('debug')) {
    (window as any)['promptMock'] = function <Key extends keyof AutoWebTypes>(key: Key, paramStr?: string) {
        setTimeout(() => {
            const param = JSON.parse(paramStr);
            let result: any;
            result = MockMethod[key](param.params);
            console.log(`[autoweb::request:${key}]`, param.params);
            console.log(`[autoweb::response:${key}]`, result);
            (window as any)[param.PROMPT_CALLBACK](result);
        }, Math.floor(Math.random() * 9999999) % 190 + 10); // 模拟异步延时
    };
    AutoWeb.setMode('promptMock')
}


// 这段代码实现了一个名为 AutoWeb 的通用桥接工具，主要用于 Web 与原生环境（如移动端或桌面应用）的通信交互，同时支持调试模式模拟异步响应‌
// 其核心功能如下：

// 一、核心功能模块
// ‌1.通信模式切换 (setMode)‌
// 动态切换通信方式（默认使用 prompt），允许替换为其他全局方法（如调试用的 promptMock）‌

// ‌2.回调函数管理 (devicelly/removeDevicelly)‌
// 将回调函数挂载到 window 对象，支持一次性执行后自动清理（once 参数）‌
// 提供手动删除回调的方法，避免内存泄漏‌

// ‌3.基础通信方法 (auto)‌
// 通过泛型 AutoWebTypes 约束事件名和参数类型，确保类型安全‌
// 支持同步（无回调）和异步（带回调）两种调用方式，自动生成唯一事件 ID 并处理 JSON 序列化‌

// 4. ‌Promise 封装 (autoPromise)‌
// 封装 auto 方法为 Promise，自动处理超时（默认 30 秒）和加载状态（FullLoading）‌
// 超时或成功响应后均会关闭加载动画，提升用户体验‌

// ‌5.调试模式支持‌
// 通过 localStorage.debug 开关启用 Mock 数据，模拟随机延迟（10-200ms）和请求/响应日志‌
// 调用 MockMethod 生成模拟数据，便于开发阶段测试‌
