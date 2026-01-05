<template>
  <v-app flat>
    <v-container class="py-7">
      <v-row justify="center">
        <v-col cols="12" sm="9">
          <v-card outlined class="pa-2">
            <v-card-title>
              <h3 class=" font-bold text-gray-500">{{ movie.Title }}
              </h3>

            </v-card-title>
            <v-card-subtitle class="mb-2 text-gray-600">
              <p class="mb-1">Year: {{ movie.Year }}</p>
            </v-card-subtitle>
            <v-img :src="movie.Poster" alt="Movie Poster" class="featured-img mb-2 ml-3" height="500" width="300">
            </v-img>

            <v-card-text>
              <p class="text-gray-700 text-base leading-relaxed">{{ movie.Plot }}</p>
            </v-card-text>
            <v-card-subtitle>
              <div v-if="trailerUrl">
                <iframe width="100%" height="315" :src="trailerUrl" frameborder="0" allowfullscreen></iframe>
              </div>
              <v-btn size="small" class="mx-1" color="primary" @click="fetchTrailer">Show Trailer</v-btn>

              <v-btn class="mx-1 " size="small" @click="toggleFavorite(movie)"
                :color="isFavorite(movie) ? 'red' : 'primary'">
                {{ isFavorite(movie) ? 'Remove from Favorites' : 'Add to Favorites' }}
              </v-btn>

            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import env from '../env'

const movie = ref({});
const route = useRoute();
const trailerUrl = ref(null)

const fetchMovieDetails = () => {
  fetch(`https://www.omdbapi.com/?apikey=${env.apikey}&i=${route.params.id}`)
    .then(res => res.json())
    .then(data => {
      movie.value = data;
    });
};

const fetchTrailer = () => {
  // Avoid embedding an API key in the client. Open YouTube search in a new tab instead.
  if (!movie.value || !movie.value.Title) {
    alert('Movie data not loaded yet.');
    return;
  }
  const query = encodeURIComponent(movie.value.Title + ' trailer');
  const url = `https://www.youtube.com/results?search_query=${query}`;
  window.open(url, '_blank');
};

onMounted(() => {
  fetchMovieDetails()
})
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser'));
  } catch {
    return null;
  }
};

const toggleFavorite = (movie) => {
  const user = getUser();
  if (!user) {
    alert('Please log in to manage favorites');
    return;
  }

  if (!user.favorites) user.favorites = [];
  const idx = user.favorites.findIndex(f => f.imdbID === movie.imdbID);
  if (idx > -1) user.favorites.splice(idx, 1);
  else user.favorites.push(movie);
  localStorage.setItem('currentUser', JSON.stringify(user));
};

const isFavorite = (movie) => {
  const user = getUser();
  if (!user || !Array.isArray(user.favorites)) return false;
  return user.favorites.some(f => f.imdbID === movie.imdbID);
};
</script>
