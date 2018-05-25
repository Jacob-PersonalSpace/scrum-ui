import Home from '../components/Home/index'
import Task from '../components/Task/index'
import Login from '../components/Login/index'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        children: [
            {
                path: 'task',
                name: 'task',
                component: Task
            }
        ]
    },
    {
        path: '*',
        redirect: { name: 'home' }
    }
]

export {
    routes
}
