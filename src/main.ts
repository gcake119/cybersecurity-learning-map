import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import LearningMap from './components/LearningMap.vue';
import SlideView from './components/SlideView.vue';
import './style.css';
const router = createRouter({ history: createWebHashHistory(), routes: [
  { path: '/map/:index(\\d+)', name: 'map', component: LearningMap },
  { path: '/learn/:index(\\d+)', name: 'learn', component: SlideView },
  { path: '/slide/:index(\\d+)', redirect: to => `/learn/${to.params.index}` },
  { path: '/:pathMatch(.*)*', redirect: '/map/0' }
], scrollBehavior: () => ({ top: 0 }) });
router.beforeEach(to => { const max=to.name==='learn'?15:8; const index=Number(to.params.index); if(index>max)return {name:to.name!,params:{index:max},replace:true}; });
createApp(App).use(router).mount('#app');
