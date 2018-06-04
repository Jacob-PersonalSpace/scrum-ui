import { SCRUM_SERVER } from './constant'

export const BACKEND_URL_HOST = {
    default: 'http://localhost:3000',
    development: 'http://localhost:3000',
    production: process.env.PRODUCTION_BACKEND_HOST || 'http://47.75.147.191:12800'
}

export const BACKEND_URL_PATH = {
    [SCRUM_SERVER.projectName]: {
        [SCRUM_SERVER.login]: { url: 'api/user/login', isAuth: false },
        [SCRUM_SERVER.getUserList]: { url: 'api/user/getUserList', isAuth: false },
        [SCRUM_SERVER.createTask]: { url: 'api/task/createTask', isAuth: false },
        [SCRUM_SERVER.getTaskList]: { url: 'api/task/getTaskList', isAuth: false },
        [SCRUM_SERVER.updateTask]: { url: 'api/task/updateTask', isAuth: false },
        [SCRUM_SERVER.getCommentList]: { url: 'api/comment/getCommentList', isAuth: false },
        [SCRUM_SERVER.deleteComment]: { url: 'api/comment/deleteComment', isAuth: false },
        [SCRUM_SERVER.addComment]: { url: 'api/comment/addComment', isAuth: false },
    }
}
