import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import LearningMap from './components/LearningMap.vue';
import SlideView from './components/SlideView.vue';
import './style.css';
const router = createRouter({ history: createWebHashHistory(), routes: [
  { path: '/map/:index(\\d+)', name: 'map', component: LearningMap },
  { path: '/slide/:index(\\d+)', name: 'slide', component: SlideView },
  { path: '/:pathMatch(.*)*', redirect: '/map/0' }
], scrollBehavior: () => ({ top: 0 }) });
router.beforeEach(to => { const max=to.name==='slide'?15:8; const index=Number(to.params.index); if(index>max)return {name:to.name!,params:{index:max},replace:true}; });
createApp(App).use(router).mount('#app');
