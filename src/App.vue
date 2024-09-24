<template>
  <v-app>
    <v-app-bar dark flat>
      <v-toolbar-title>
        <router-link to="/">
          <v-btn size="large">My Vue Movies</v-btn>
        </router-link>
      </v-toolbar-title>
      <!-- <v-spacer></v-spacer> -->
      <v-btn v-if="!isLoggedIn" text @click="goToLogin">Login</v-btn>
      <v-btn v-if="!isLoggedIn" text @click="goToRegister">Register</v-btn>
      <v-btn v-if="isLoggedIn" @click="logout">Logout</v-btn>
      <v-btn @click="goToFavorites">Favorites</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const isLoggedIn = ref(false);
const router = useRouter();

onMounted(() => {
  checkLoginStatus();
});

const checkLoginStatus = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  isLoggedIn.value = currentUser && currentUser.isLoggedIn;
};

watchEffect(() => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser && currentUser.isLoggedIn !== isLoggedIn.value) {
    isLoggedIn.value = currentUser.isLoggedIn;
  }
});

const goToLogin = () => {
  router.push('/login');
};

const goToRegister = () => {
  router.push('/register');
};


const logout = () => {
  localStorage.removeItem('currentUser');
  isLoggedIn.value = false;
  router.push('/login');
};


const goToFavorites = () => {
  router.push('/favorites');
};
</script>
