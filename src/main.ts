import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import LandingV2 from './v2/LandingV2.vue';
import LessonV2 from './v2/LessonV2.vue';
import FinalV2 from './v2/FinalV2.vue';
import { bySlug } from './v2/course';
import './style.css';
import './v2/v2.css';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/v2', name: 'v2-home', component: LandingV2 },
    { path: '/v2/final', name: 'v2-final', component: FinalV2 },
    { path: '/v2/:slug', name: 'v2-unit', component: LessonV2 },
    { path: '/:pathMatch(.*)*', redirect: '/v2' }
  ],
  scrollBehavior: () => ({ top: 0 })
});
router.beforeEach(to => {
  if (to.name === 'v2-unit' && !bySlug[String(to.params.slug)]) return '/v2';
});
createApp(App).use(router).mount('#app');
