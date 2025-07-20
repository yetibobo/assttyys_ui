<script setup lang="ts">

// 导入Vue核心API
import { onMounted, ref } from 'vue';
// 导入自定义工具类（用于原生能力调用）
import { AutoWeb } from './tools/AutoWeb';
// 导入版本对话框组件
import VersionDialog from './components/VersionDialog.vue';

// 定义响应式状态栏高度变量（初始为0）
const statusBarHeight = ref<number>(0);
    
// 组件挂载后执行原生API调用
onMounted(async () => {
    // 通过AutoWeb获取系统状态栏高度
    statusBarHeight.value = await AutoWeb.autoPromise('getStatusBarHeight');
});

</script>

<template>
     <!-- 动态设置容器高度和顶部内边距 -->
    <div :style="`height: 100%; padding-top: ${statusBarHeight}px`">
        <!-- 渲染路由视图 -->
        <RouterView />
    </div>
</template>


<style scoped>/* 这是一个作用域样式注释当前为空 */</style>
<style>/* 全局样式为空*/</style>
