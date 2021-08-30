import {apiPathAuthToken} from "./routes";

export const API_BASE_URL = "http://localhost:8000"

export class ApiClient {
    constructor() {
        this.base_url = API_BASE_URL
        this.headers = {
            'Content-Type': 'application/json'
        }
        this.credentials = 'same-origin'
    }

    request = (relPath, httpMethod, data) => {
        let url = this.base_url + relPath
        let fetchParams = {
            method: httpMethod,
            headers: this.headers,
            credentials: this.credentials,
        }
        if (data !== undefined) {
            if (['GET', 'HEAD'].includes(httpMethod)) {
                url += `?${new URLSearchParams(data)}`
            } else {
                fetchParams.body = JSON.stringify(data)
            }
        }
        return fetch(url, fetchParams).then(response => {
            return response.json().then(data => {
                return {status: response.status, data: data}
            })
        })
    }

    get = (relPath, data) => {
        return this.request(relPath, 'GET', data)
    }

    post = (relPath, data) => {
        return this.request(relPath, 'POST', data)
    }

    put = (relPath, data) => {
        return this.request(relPath, 'PUT', data)
    }

    login = (requestData) => {
        return this.post(apiPathAuthToken, requestData).then(({status, data}) => {
            if (status === 200) {
                this.setAuthorizationHeader(data.token)
            }
            return {status, data}
        })
    }

    setAuthorizationHeader = (token) => {
        this.headers.Authorization = `Token ${token}`
    }

    logout = () => {
        delete this.headers.Authorization
    }
}

export const apiClient = new ApiClient()