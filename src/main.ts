import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import LearningMap from './components/LearningMap.vue';
import LabView from './components/LabView.vue';
import {slides} from './content/learning';
import './style.css';
const router = createRouter({ history: createWebHashHistory(), routes: [
  { path: '/map/:index(\\d+)', name: 'map', component: LearningMap },
  { path: '/lab/:index(\\d+)', name: 'lab', component: LabView },
  { path: '/learn/:index(\\d+)', redirect: to => `/lab/${slides[Number(to.params.index)]?.phase??0}` },
  { path: '/slide/:index(\\d+)', redirect: to => `/learn/${to.params.index}` },
  { path: '/:pathMatch(.*)*', redirect: '/map/0' }
], scrollBehavior: () => ({ top: 0 }) });
router.beforeEach(to => { const max=8; const index=Number(to.params.index); if(index>max)return {name:to.name!,params:{index:max},replace:true}; });
createApp(App).use(router).mount('#app');
