<!-- Favorites.vue -->
<template>
  <v-container>
    <v-row>
      <v-col v-for="movie in favorites" :key="movie.imdbID" cols="12" sm="6" md="4">
        <v-card>
          <v-img :src="movie.Poster" height="200"></v-img>
          <v-card-title>{{ movie.Title }}</v-card-title>
          <v-card-subtitle>{{ movie.Year }}</v-card-subtitle>
          <v-card-actions>
            <v-btn @click="removeFavorite(movie)">Remove</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-btn class="mt-4" @click="addSampleFavorite">Add Sample Favorite</v-btn>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import env from '../env.js';

const favorites = ref([]);

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (user) {
    favorites.value = user.favorites;
  } else {
    alert('You need to log in');
  }
});

const removeFavorite = (movie) => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  user.favorites = user.favorites.filter(fav => fav.imdbID !== movie.imdbID);
  localStorage.setItem('currentUser', JSON.stringify(user));
  favorites.value = user.favorites;
};

const addSampleFavorite = () => {
  const sampleMovie = {
    imdbID: 'tt1234567',
    Title: 'Sample Movie',
    Poster: 'https://via.placeholder.com/150',
    Year: '2024'
  };
  const user = JSON.parse(localStorage.getItem('currentUser'));
  user.favorites.push(sampleMovie);
  localStorage.setItem('currentUser', JSON.stringify(user));
  favorites.value = user.favorites;
};
</script>
