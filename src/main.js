import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import 'vuetify/dist/vuetify.min.css'

const vuetify = createVuetify(
  {
    theme: {
      defaultTheme: 'dark',
    },
  }
); // Vuetify instance

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount('#app');
