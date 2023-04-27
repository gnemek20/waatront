import axios from "axios";
import router from "@/router/index.js";

// const address = 'https://port-0-waatack-6g2llfkyykgm.sel3.cloudtype.app';
const address = 'http://waat.kro.kr:3000';

export default {
  install(Vue) {
    Vue.prototype.$get = functions.get;
    Vue.prototype.$post = functions.post;
    Vue.prototype.$push = functions.push;
    Vue.prototype.$reload = functions.reload;
  }
}

export const functions = {
  get: (location) => {
    return axios.get(`${address}${location}`);
  },
  post: (location, form) => {
    return axios.post(`${address}${location}`, form);
  },
  push: (location) => {
    return router.push(location).catch(() => {});
  },
  reload: () => {
    return router.go();
  }
}