import axios from 'axios'

import { BACKEND_URL_HOST } from './backendUrl.config'

export const getBackendUrlHost = () => {
    const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'default'

    console.log(`env: ${env}`)

    return BACKEND_URL_HOST[env]
}

export const getDataFromBackend = async ({ url, options }) => {
    const { data } = await axios(url, options)

    if (data.code === 200) {
        return data.data
    } else if (data.code === 500) {
        throw new Error(data.message)
    }
}
