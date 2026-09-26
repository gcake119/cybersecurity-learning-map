import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import LearningMap from './components/LearningMap.vue';
import LabView from './components/LabView.vue';
import DeepPractice from './components/DeepPractice.vue';
import LandingV2 from './v2/LandingV2.vue';
import LessonV2 from './v2/LessonV2.vue';
import FinalV2 from './v2/FinalV2.vue';
import {bySlug} from './v2/course';
import {slides} from './content/learning';
import './style.css';
import './v2/v2.css';
const router = createRouter({ history: createWebHashHistory(), routes: [
  { path: '/v2', name:'v2-home', component: LandingV2 },
  { path: '/v2/final', name:'v2-final', component: FinalV2 },
  { path: '/v2/:slug', name:'v2-unit', component: LessonV2, beforeEnter: to => bySlug[String(to.params.slug)] ? true : '/v2' },
  { path: '/map/:index(\\d+)', name: 'map', component: LearningMap },
  { path: '/lab/:index(\\d+)', name: 'lab', component: LabView },
  { path: '/practice/:index(\\d+)', name: 'practice', component: DeepPractice },
  { path: '/mission/:index(\\d+)', name: 'mission', component: DeepPractice },
  { path: '/learn/:index(\\d+)', redirect: to => '/lab/'+(slides[Number(to.params.index)]?.phase??0) },
  { path: '/slide/:index(\\d+)', redirect: to => '/learn/'+to.params.index },
  { path: '/:pathMatch(.*)*', redirect: '/v2' }
], scrollBehavior: () => ({ top: 0 }) });
router.beforeEach(to => { if(to.name==='v2-unit'&&!bySlug[String(to.params.slug)]) return '/v2'; if(String(to.path).startsWith('/v2')) return true; const max=to.name==='mission'?2:8; const index=Number(to.params.index); if(index>max)return {name:to.name!,params:{index:max},replace:true}; });
createApp(App).use(router).mount('#app');
