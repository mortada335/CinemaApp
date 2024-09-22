<template>
  <v-app>
    <v-main>
      <v-container class="fill-height d-flex align-center justify-center">
        <v-row justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card>
              <v-card-title class="text-center">Register</v-card-title>
              <v-card-text>
                <v-form @submit.prevent="register">
                  <v-text-field v-model="email" label="Email" type="email" required></v-text-field>
                  <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
                  <v-btn type="submit" color="primary" block>Register</v-btn>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn text @click="goToLogin">Already have an account? Login</v-btn>
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

const register = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  users.push({ email: email.value, password: password.value });
  localStorage.setItem('users', JSON.stringify(users));
  router.push('/login');
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
