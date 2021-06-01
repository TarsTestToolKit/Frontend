import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
//完整引入elementplus组件
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'

const app=createApp(App)

app.use(ElementPlus,{locale})
app.use(router)
app.mount('#app')


//https://g2plot.antv.vision/zh

//图表示例
//https://antv-g2plot.gitee.io/zh/examples/gallery

//element plus
//https://element-plus.gitee.io/





