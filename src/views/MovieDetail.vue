<template>
  <v-app flat>
    <v-container class="py-7">
      <v-row justify="center">
        <v-col cols="12" sm="9">
          <v-card outlined class="pa-2">
            <v-card-title>
              <h3 class="font-bold text-gray-500">{{ movie.Title }}</h3>
            </v-card-title>
            <v-card-subtitle class="mb-4 text-gray-600">
              <p class="mb-1">Year: {{ movie.Year }}</p>
            </v-card-subtitle>
            <v-img :src="movie.Poster" alt="Movie Poster" class="featured-img mb-4" height="500" width="300" />
            <v-card-text>
              <p class="text-gray-700 text-base leading-relaxed">{{ movie.Plot }}</p>
            </v-card-text>
            <div v-if="trailerUrl">
              <iframe width="100%" height="315" :src="trailerUrl" frameborder="0" allowfullscreen></iframe>
            </div>
            <v-btn size="small" color="primary" class="mx-2" @click="fetchTrailer">Show Trailer</v-btn>
            <v-btn size="small" :color="isFavorite(movie) ? 'red' : 'primary'" class="mx-2"
              @click="toggleFavorite(movie)">
              {{ isFavorite(movie) ? 'Remove from Favorites' : 'Add to Favorites' }}
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import env from '../env';

const movie = ref({});
const trailerUrl = ref(null);
const route = useRoute();

const fetchMovieDetails = async () => {
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${env.apikey}&i=${route.params.id}`);
    const data = await response.json();
    movie.value = data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
  }
};

const fetchTrailer = async () => {
  try {
    const trailerSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
      movie.value.Title + ' trailer'
    )}&key=AIzaSyCn_aPYeqTQ53w8MmSHcHNGNUhU7LaY-pE`;

    const response = await fetch(trailerSearchUrl);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      trailerUrl.value = `https://www.youtube.com/embed/${videoId}`;
    } else {
      alert('No trailer available for this movie.');
    }
  } catch (error) {
    console.error('Error fetching trailer:', error);
  }
};

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

onMounted(fetchMovieDetails);
</script>
