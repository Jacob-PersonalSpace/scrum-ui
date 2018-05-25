import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'js-cookie'

import { routes } from './routes'

Vue.use(Router)

const router = new Router({
    routes
})

router.beforeEach((to, from, next) => {
    if (!Cookies.get('user') && to.name != 'login') {
        next({
            name: 'login'
        })
    } else if (Cookies.get('user') && to.name === 'login') {
        next({
            name: 'home'
        })
    } else {
        next()
    }
})

export default router
