import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import moment from 'moment';
require('moment/locale/es');
moment.locale('es');

createApp(App).use(moment).use(VueAxios, axios).use(store).use(router).mount('#app')
