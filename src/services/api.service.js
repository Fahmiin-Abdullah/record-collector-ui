import axios from 'axios'

const API_URL = 'http://localhost:3000'

const securedAxiosInstance = axios.create({
  baseUrl: API_URL,
  withCredentials: true,
  headers: { 'Content-type': 'application/json' }
})

const plainAxiosInstance = axios.create({
  baseUrl: API_URL,
  withCredentials: true,
  headers: { 'Content-type': 'application/json' }
})

securedAxiosInstance.interceptors.request.use(config => {
  const method = config.method.toUpperCase()
  if (method !== 'OPTIONS' && method !== 'GET') {
    config.headers = { ...config.headers, 'X-CSRF-TOKEN': localStorage.csrf }
  }

  return config
})

securedAxiosInstance.interceptors.response.use(null, error => {
  if (error.response && error.response.config && error.response.status === 401) {
    return plainAxiosInstance.post('/refresh', {}, { headers: { 'X-CSRF-TOKEN': localStorage.csrf } })
                             .then(res => {
                               localStorage.csrf = res.data.csrf
                               localStorage.signedIn = true

                               let retryConfig = error.response.config
                               retryConfig.headers['X-CSRF-TOKEN'] = localStorage.csrf
                               return plainAxiosInstance.request(retryConfig)
                             })
                             .catch(err => {
                               delete localStorage.csrf
                               delete localStorage.signedIn

                               location.replace('/')
                               return Promise.reject(err)
                             })
  } else return Promise.reject(error)
})

export { securedAxiosInstance, plainAxiosInstance }
