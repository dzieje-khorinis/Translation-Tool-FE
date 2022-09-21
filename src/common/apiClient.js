import { apiPathAuthToken } from './routes';
import { LANG_EN } from './constants';

export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const SUB_URL = process.env.REACT_APP_SUB_URL;
export const PUB_URL = process.env.REACT_APP_PUB_URL;

export class ApiClient {
  constructor() {
    this.base_url = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept-Language': localStorage.getItem('lang') || LANG_EN,
    };
    this.credentials = 'same-origin';
  }

  request = (relPath, httpMethod, data) => {
    let url = this.base_url + relPath;
    const fetchParams = {
      method: httpMethod,
      headers: this.headers,
      credentials: this.credentials,
    };
    if (data !== undefined) {
      if (['GET', 'HEAD'].includes(httpMethod)) {
        url += `?${new URLSearchParams(data)}`;
      } else {
        fetchParams.body = JSON.stringify(data);
      }
    }
    return fetch(url, fetchParams).then((response) => {
      /* eslint-disable-next-line no-shadow */
      return response.json().then((data) => {
        return { status: response.status, data };
      });
    });
  };

  get = (relPath, data) => {
    return this.request(relPath, 'GET', data);
  };

  post = (relPath, data) => {
    return this.request(relPath, 'POST', data);
  };

  put = (relPath, data) => {
    return this.request(relPath, 'PUT', data);
  };

  login = (requestData) => {
    return this.post(apiPathAuthToken, requestData).then(({ status, data }) => {
      if (status === 200) {
        this.setAuthorizationHeader(data.token);
      }
      return { status, data };
    });
  };

  setAuthorizationHeader = (token) => {
    this.headers.Authorization = `Token ${token}`;
  };

  logout = () => {
    delete this.headers.Authorization;
  };

  setAcceptLanguageHeader = (lang) => {
    this.headers['Accept-Language'] = lang;
  };
}

export const apiClient = new ApiClient();
