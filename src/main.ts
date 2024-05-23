import { createApp } from 'vue'
import './style.css'
import App from './App.vue'


// 引入router
import {setupRouter} from "./router";

const setupApp = async() => {
    const app = createApp(App);

    // 创建路由
    setupRouter(app);
    app.mount('#app')
}

setupApp();
