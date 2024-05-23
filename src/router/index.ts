import {createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ModelRouter from "./modules/model.ts";
import type {App} from 'vue'


export const publicRoutes: Array<RouteRecordRaw> = [
    ModelRouter,
    {
        path:'/',
        name: 'index',
        component: () => import('../views/model/index.vue')
    },
];

const router = createRouter({
    history:createWebHistory(),
    routes: publicRoutes
});

/* 初始化路由表 */
export function resetRouter() {
    router.getRoutes().forEach((route) => {
        const { name } = route;
        if (name) {
            router.hasRoute(name) && router.removeRoute(name);
        }
    });
}


/* 导出 setupRouter */
export const setupRouter = (app: App<Element>) => {
    app.use(router);
}