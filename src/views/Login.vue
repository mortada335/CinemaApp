<template>
  <v-app>
    <v-main><v-container class="fill-height d-flex align-center justify-center">
        <v-row justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card>
              <v-card-title class="text-center">Login</v-card-title>
              <v-card-text>
                <v-form @submit.prevent="login">
                  <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
                  <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                  <v-btn type="submit" color="primary" block>Login</v-btn>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn text @click="goToRegister">Don't have an account? Register</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>

</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();
const isLoggedIn = ref(false);

const goToRegister = () => {
  router.push('/register')
}

const checkLoginStatus = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  isLoggedIn.value = currentUser && currentUser.isLoggedIn;
};

const login = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email.value && u.password === password.value);

  if (user) {

    localStorage.setItem('currentUser', JSON.stringify({ ...user, isLoggedIn: true }));

    checkLoginStatus();

    router.push('/');
  } else {
    alert('Invalid email or password');
  }
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
