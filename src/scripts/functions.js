import axios from "axios";

const address = 'https://port-0-waatack-6g2llfkyykgm.sel3.cloudtype.app';

export default {
  install(Vue) {
    Vue.prototype.$get = functions.get;
    Vue.prototype.$post = functions.post;
  }
}

export const functions = {
  get: (argv) => {
    return axios.get(`${address}${argv}`);
  },
  post: (argv, form) => {
    return axios.post(`${address}${argv}`, form);
  }
}