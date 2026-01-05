import { createWebHistory, createRouter } from 'vue-router';
import Home from '@/views/Home.vue';
import MovieDetail from '@/views/MovieDetail.vue';
import Register from '@/views/Register.vue';
import Login from '@/views/Login.vue';
import Favorites from '@/views/Favorites.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/movie/:id', name: 'Movie Detail', component: MovieDetail },
  { path: '/register', name: 'Register', component: Register },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    beforeEnter: (to, from, next) => {
      try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user && user.isLoggedIn) next();
        else next('/login');
      } catch {
        next('/login');
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
