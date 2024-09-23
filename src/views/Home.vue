<template>
  <v-app app fixed>
    <v-app-bar fixed flat>
      <v-container>
        <v-form @submit.prevent="searchMovies" class="d-flex align-center fixed-search">
          <v-row align="center">
            <v-col cols="6" md="3">
              <v-text-field v-model="search" label="What are you looking for?" hide-details></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row v-if="!movies.length">
          <v-col v-for="movie in initialMovies" :key="movie.imdbID" cols="12" sm="6" md="4">
            <v-card>
              <router-link :to="'/movie/' + movie.imdbID">
                <v-img :src="movie.Poster" height="400"></v-img>
              </router-link>

              <v-card-title>{{ movie.Title }}</v-card-title>
              <v-card-subtitle>{{ movie.Year }}</v-card-subtitle>
              <v-card-actions>
                <v-btn :to="'/movie/' + movie.imdbID" text color="primary">Details</v-btn>
                <v-btn @click="toggleFavorite(movie)" :color="isFavorite(movie) ? 'red' : 'primary'">
                  {{ isFavorite(movie) ? 'Remove from Favorites' : 'Add to Favorites' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Search Results -->
        <v-row v-if="movies.length">
          <v-col v-for="movie in movies" :key="movie.imdbID" cols="12" sm="6" md="4">
            <v-card>
              <router-link :to="'/movie/' + movie.imdbID">
                <v-img :src="movie.Poster" height="400"></v-img>
              </router-link>

              <v-card-title>{{ movie.Title }}</v-card-title>
              <v-card-subtitle>{{ movie.Year }}</v-card-subtitle>
              <v-card-actions>
                <v-btn :to="'/movie/' + movie.imdbID" text color="primary">Details</v-btn>
                <v-btn @click="toggleFavorite(movie)" :color="isFavorite(movie) ? 'red' : 'primary'">
                  {{ isFavorite(movie) ? 'Remove from Favorites' : 'Add to Favorites' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import env from '../env';

const search = ref('');
const movies = ref([]);
const initialMovies = ref([]);
const router = useRouter();

const fetchInitialMovies = async () => {
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${env.apikey}&s=action`);
    const data = await response.json();
    if (data.Search) {
      initialMovies.value = data.Search;
    }
  } catch (error) {
    console.error('Error fetching initial movies:', error);
  }
};

const searchMovies = async () => {
  if (!search.value) return;
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${env.apikey}&s=${search.value}`);
    const data = await response.json();
    if (data.Search) {
      movies.value = data.Search;
    } else {
      movies.value = [];
    }
  } catch (error) {
    console.error('Error searching for movies:', error);
  } finally {
    search.value = '';
  }
};

const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const debouncedSearchMovies = debounce(searchMovies, 500);

const getUser = () => {
  return JSON.parse(localStorage.getItem('currentUser'));
};

const toggleFavorite = (movie) => {
  const user = getUser();
  if (user) {
    let favorites = user.favorites || [];
    const index = favorites.findIndex(fav => fav.imdbID === movie.imdbID);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(movie);
    }
    user.favorites = favorites;
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    alert('Please log in to manage favorites');
  }
};

const isFavorite = (movie) => {
  const user = getUser();
  return user ? user.favorites.some(fav => fav.imdbID === movie.imdbID) : false;
};
onMounted(() => {
  fetchInitialMovies();
});
</script>
