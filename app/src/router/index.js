import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
// import EventCard from '../components/EventCard.vue';

const routes = [
  { path: '/', component: Home },
  // { path: '/event/:id', component: EventCard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
