import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter);

const routes = [{
    path: '/',
    component: () => import('@/components/index.vue')
}, {
    path: '/cuboid',
    component: () => import('@/components/Cuboid/index.vue')
}];

const router = new VueRouter({
    routes
});

export default router;