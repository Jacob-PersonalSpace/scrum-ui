import axios from 'axios'

import { BACKEND_URL_HOST } from './backendUrl.config'

export const getBackendUrlHost = () => {
    const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'default'

    console.log(`env: ${env}`);

    return BACKEND_URL_HOST[env]
}

const validateResult = (result) => new Promise((resolve, reject) => {
    if (result) {
        resolve(result)
        // if (result.result) {
        //     resolve(result.result)
        // } else {
        //     reject('Sorry, api return success but no result.')
        // }
    } else {
        reject('Sorry, no result is obtained from the system. Operation is aborted.')
    }
})

export const getDataFromBackend = ({ url, options }) => {
    return axios(url, options)
        .then(({ data }) => validateResult(data))
}
