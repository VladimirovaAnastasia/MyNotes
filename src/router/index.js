import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from "firebase/app";

Vue.use(VueRouter);

const routes = [
    {
        path: '/login',
        name: 'login',
        meta: {
            layout: 'empty',
            title: 'Страница логина'
        },
        component: () => import('../views/Login.vue')
    },
    {
        path: '/notes',
        name: 'AllNotes',
        meta: {
            layout: 'main',
            auth: true,
            title: 'Все заметки'
        },
        component: () => import('../views/notes/AllNotes.vue')
    },
    {
        path: '/archive',
        name: 'Archive',
        meta: {
            layout: 'main',
            auth: true,
            title: 'Архив заметок'
        },
        component: () => import('../views/notes/ArchiveNotes.vue')
    },
    {
        path: '/new',
        name: 'NewNotes',
        meta: {
            layout: 'main',
            auth: true,
            title: 'Новые заметки'
        },
        component: () => import('../views/notes/NewNotes.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        meta: {
            layout: 'main',
            auth: true,
            title: 'Профиль пользователя'
        },
        component: () => import('../views/Profile.vue')
    },
    {
        path: '/note/:id',
        name: 'note',
        meta: {
            layout: 'main',
            auth: true,
            title: 'Редактирование заметки'
        },
        component: () => import('../views/notes/EditNote.vue')
    },
    {
        path: "*",
        meta: {
            layout: 'empty',
            title: 'Страница не найдена'
        },
        component: () => import('../views/PageNotFound.vue')
    },
    {path: '/', redirect: '/notes'}
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});


router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.title) {
        document.title = to.meta.title;
    }
    const currentUser = firebase.auth().currentUser;
    const requiredAuth = to.matched.some(record => record.meta.auth);
    if (requiredAuth && !currentUser) {
        next('/login')
    } else {
        next()
    }
});
export default router
