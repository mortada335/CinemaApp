<template>
  <v-app app fixed>
    <v-app-bar fixed flat>
      <v-container>
        <v-form @submit.prevent="searchMovies" class="d-flex align-center fixed-search">
          <v-row align="center">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="search"
                label="Search movies"
                hide-details
                clearable
                append-icon="mdi-magnify"
                @click:append="searchMovies"
                @input="onInput"
                :disabled="loading"
                aria-label="Search movies"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>
            <v-alert type="error" v-if="error" dense>
              {{ error }}
            </v-alert>
            <v-alert type="info" v-if="!loading && !moviesToShow.length">
              No movies found. Try a different search or check your connection.
            </v-alert>
          </v-col>
        </v-row>

        <v-row>
          <v-col v-for="movie in moviesToShow" :key="movie.imdbID" cols="12" sm="6" md="4">
            <v-card>
              <router-link :to="`/movie/${movie.imdbID}`">
                <v-img :src="movie.Poster !== 'N/A' ? movie.Poster : placeholder" height="400" alt="Movie poster"></v-img>
              </router-link>

              <v-card-title class="text-truncate">{{ movie.Title }}</v-card-title>
              <v-card-subtitle>{{ movie.Year }}</v-card-subtitle>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  small
                  :color="isFavorite(movie) ? 'red' : 'primary'"
                  @click="toggleFavorite(movie)"
                  aria-pressed="isFavorite(movie)"
                >
                  {{ isFavorite(movie) ? 'Remove' : 'Add' }}
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
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import env from '../env';

const search = ref('');
const movies = ref([]);
const initialMovies = ref([]);
const loading = ref(false);
const error = ref('');
const snackbar = ref(false);
const snackbarMessage = ref('');
const placeholder = '/placeholder.png';

const router = useRouter();

const fetchInitialMovies = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${env.apikey}&s=action`);
    const data = await response.json();
    if (data.Search) {
      initialMovies.value = data.Search;
    }
  } catch (err) {
    console.error('Error fetching initial movies:', err);
    error.value = 'Failed to load initial movies.';
  } finally {
    loading.value = false;
  }
};

const searchMovies = async () => {
  if (!search.value) return;
  loading.value = true;
  error.value = '';
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${env.apikey}&s=${encodeURIComponent(search.value)}`);
    const data = await response.json();
    if (data.Search) {
      movies.value = data.Search;
    } else {
      movies.value = [];
    }
  } catch (err) {
    console.error('Error searching for movies:', err);
    error.value = 'Search failed. Please try again.';
  } finally {
    loading.value = false;
  }
};

// debounce helper with cancel
const debounce = (fn, delay) => {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
};

const debouncedSearch = debounce(() => {
  if (search.value && search.value.trim()) searchMovies();
}, 500);

onUnmounted(() => debouncedSearch.cancel());

const onInput = () => {
  // live search while typing with debounce
  debouncedSearch();
};

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser'));
  } catch {
    return null;
  }
};

const currentUser = ref(getUser());

const persistUser = () => {
  if (currentUser.value) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value));
  }
};

const toggleFavorite = (movie) => {
  if (!currentUser.value) {
    snackbarMessage.value = 'Please log in to manage favorites.';
    snackbar.value = true;
    return;
  }

  const favorites = currentUser.value.favorites || [];
  const idx = favorites.findIndex(f => f.imdbID === movie.imdbID);
  if (idx > -1) {
    favorites.splice(idx, 1);
    snackbarMessage.value = 'Removed from favorites.';
  } else {
    favorites.push(movie);
    snackbarMessage.value = 'Added to favorites.';
  }
  currentUser.value.favorites = favorites;
  persistUser();
  snackbar.value = true;
};

const isFavorite = (movie) => {
  if (!currentUser.value || !currentUser.value.favorites) return false;
  return currentUser.value.favorites.some(f => f.imdbID === movie.imdbID);
};

const moviesToShow = computed(() => {
  return movies.value.length ? movies.value : initialMovies.value;
});

onMounted(() => {
  fetchInitialMovies();
  currentUser.value = getUser();
});
</script>
