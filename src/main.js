import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control
import api from "./api/index";
import selectfrom from "./components/selectfrom/index.vue";

Vue.component("selectfrom", selectfrom);
if (process.env.NODE_ENV === "production") {
  const { mockXHR } = require("../mock");
  mockXHR();
}
Vue.directive("focus", {
  inserted: function (el) {
    el.querySelector("input").focus();
  },
});
// set ElementUI lang to EN
Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;
Vue.prototype.$API = api;
new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
