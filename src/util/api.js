import { BACKEND_URL_PATH } from './backendUrl.config'
import { SCRUM_SERVER } from './constant'
import { getBackendUrlHost, getDataFromBackend } from './helper'

const backendUrlHost = getBackendUrlHost()

console.log(`backendUrlHost: ${backendUrlHost}`);

export const loginApi = ({ userName }) => {
    const projectKey = SCRUM_SERVER.projectName
    const apiKey = SCRUM_SERVER.login

    const url = backendUrlHost + '/' + BACKEND_URL_PATH[projectKey][apiKey].url,
        options = {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ userName })
        }

    console.log(`loginApi url: ${url}, options: ${JSON.stringify(options)}`)

    return getDataFromBackend({
        url,
        options,
    }).then(result => result)
}

export const getUserListApi = () => {
    const projectKey = SCRUM_SERVER.projectName
    const apiKey = SCRUM_SERVER.getUserList

    const url = backendUrlHost + '/' + BACKEND_URL_PATH[projectKey][apiKey].url,
        options = {
            credentials: 'same-origin',
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }

    console.log(`getUserListApi url: ${url}, options: ${JSON.stringify(options)}`)

    return getDataFromBackend({
        url,
        options,
    }).then(result => result)
}

export const createTaskApi = ({ taskTag, userId, taskName, taskDescription }) => {
    const projectKey = SCRUM_SERVER.projectName
    const apiKey = SCRUM_SERVER.createTask

    const url = backendUrlHost + '/' + BACKEND_URL_PATH[projectKey][apiKey].url,
        options = {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ taskTag, userId, taskName, taskDescription })
        }

    console.log(`createTaskApi url: ${url}, options: ${JSON.stringify(options)}`)

    return getDataFromBackend({
        url,
        options,
    }).then(result => result)
}

export const getTaskListApi = () => {
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

    console.log(`getTaskListApi url: ${url}, options: ${JSON.stringify(options)}`)

    return getDataFromBackend({
        url,
        options,
    }).then(result => result)
}

export const updateTaskApi = ({ userId, taskId, status, ownerId, timeSpend }) => {
    const projectKey = SCRUM_SERVER.projectName
    const apiKey = SCRUM_SERVER.updateTask

    const url = backendUrlHost + '/' + BACKEND_URL_PATH[projectKey][apiKey].url,
        options = {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ userId, id: taskId, status, owner: ownerId, timeSpend })
        }

    console.log(`updateTaskApi url: ${url}, options: ${JSON.stringify(options)}`)

    return getDataFromBackend({
        url,
        options,
    }).then(result => result)
}

export const deleteCommentApi = ({ userId, id }) => {
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

    console.log(`deleteCommentApi url: ${url}, options: ${JSON.stringify(options)}`)

    return getDataFromBackend({
        url,
        options,
    }).then(result => result)
}

export const getCommentListApi = ({ taskId }) => {
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

    console.log(`getCommentListApi url: ${url}, options: ${JSON.stringify(options)}`)

    return getDataFromBackend({
        url,
        options,
    }).then(result => result)
}

export const addCommentApi = ({ taskId, comment, userId }) => {
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

    console.log(`addCommentApi url: ${url}, options: ${JSON.stringify(options)}`)

    return getDataFromBackend({
        url,
        options,
    }).then(result => result)
}
