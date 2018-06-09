import { BACKEND_URL_PATH } from './backendUrl.config'
import { SCRUM_SERVER } from './constant'
import { getBackendUrlHost, getDataFromBackend } from './helper'

const backendUrlHost = getBackendUrlHost()

console.log(`backendUrlHost: ${backendUrlHost}`);

export const loginApi = async ({ userName }) => {
    const projectKey = SCRUM_SERVER.projectName,
        apiKey = SCRUM_SERVER.login,
        url = backendUrlHost + '/' + BACKEND_URL_PATH[projectKey][apiKey].url,
        options = {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ userName })
        }

    console.debug(`loginApi url: ${url}, options: ${JSON.stringify(options)}`)

    return await getDataFromBackend({ url, options })
}

export const getUserListApi = async () => {
    const projectKey = SCRUM_SERVER.projectName,
        apiKey = SCRUM_SERVER.getUserList,
        url = backendUrlHost + '/' + BACKEND_URL_PATH[projectKey][apiKey].url,
        options = {
            credentials: 'same-origin',
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }

    console.debug(`getUserListApi url: ${url}, options: ${JSON.stringify(options)}`)

    return await getDataFromBackend({ url, options })
}

export const createTaskApi = async ({ taskTag, userId, taskName, taskDescription }) => {
    const projectKey = SCRUM_SERVER.projectName,
        apiKey = SCRUM_SERVER.createTask,
        url = backendUrlHost + '/' + BACKEND_URL_PATH[projectKey][apiKey].url,
        options = {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ taskTag, userId, taskName, taskDescription })
        }

    console.debug(`createTaskApi url: ${url}, options: ${JSON.stringify(options)}`)

    return await getDataFromBackend({ url, options })
}

export const getTaskListApi = async () => {
    const projectKey = SCRUM_SERVER.projectName,
        apiKey = SCRUM_SERVER.getTaskList,
        url = backendUrlHost + '/' + BACKEND_URL_PATH[projectKey][apiKey].url,
        options = {
            credentials: 'same-origin',
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }

    console.debug(`getTaskListApi url: ${url}, options: ${JSON.stringify(options)}`)

    return await getDataFromBackend({ url, options })
}

export const updateTaskApi = async ({ userId, taskId, status, ownerId, timeSpend }) => {
    const projectKey = SCRUM_SERVER.projectName,
        apiKey = SCRUM_SERVER.updateTask,
        url = backendUrlHost + '/' + BACKEND_URL_PATH[projectKey][apiKey].url,
        options = {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ userId, id: taskId, status, owner: ownerId, timeSpend })
        }

    console.debug(`updateTaskApi url: ${url}, options: ${JSON.stringify(options)}`)

    return await getDataFromBackend({ url, options })
}

export const deleteCommentApi = async ({ userId, id }) => {
    const projectKey = SCRUM_SERVER.projectName,
        apiKey = SCRUM_SERVER.deleteComment,
        url = backendUrlHost + '/' + BACKEND_URL_PATH[projectKey][apiKey].url,
        options = {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ userId, id })
        }

    console.debug(`deleteCommentApi url: ${url}, options: ${JSON.stringify(options)}`)

    return await getDataFromBackend({ url, options })
}

export const getCommentListApi = async ({ taskId }) => {
    const projectKey = SCRUM_SERVER.projectName,
        apiKey = SCRUM_SERVER.getCommentList,
        url = backendUrlHost + '/' + BACKEND_URL_PATH[projectKey][apiKey].url,
        options = {
            credentials: 'same-origin',
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            params: {
                taskId,
            },
        }

    console.debug(`getCommentListApi url: ${url}, options: ${JSON.stringify(options)}`)

    return await getDataFromBackend({ url, options })
}

export const addCommentApi = async ({ taskId, comment, userId }) => {
    const projectKey = SCRUM_SERVER.projectName,
        apiKey = SCRUM_SERVER.addComment,
        url = backendUrlHost + '/' + BACKEND_URL_PATH[projectKey][apiKey].url,
        options = {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ taskId, comment, userId })
        }

    console.debug(`addCommentApi url: ${url}, options: ${JSON.stringify(options)}`)

    return await getDataFromBackend({ url, options })
}
