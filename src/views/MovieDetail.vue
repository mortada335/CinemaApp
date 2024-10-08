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
  const trailerSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(movie.value.Title + ' trailer')}&key=AIzaSyCn_aPYeqTQ53w8MmSHcHNGNUhU7LaY-pE`

  fetch(trailerSearchUrl).then(res => res.json()).then(data => {
    if (data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      trailerUrl.value = `https://www.youtube.com/embed/${videoId}`
    }
    else {
      alert('no trailer available for this movie.')
    }
  })
    .catch(err => {
      console.log("error fetching trailer:", err);
    })
};

onMounted(() => {
  fetchMovieDetails()
})
const toggleFavorite = (movie) => {
  let user = JSON.parse(localStorage.getItem('currentUser'));
  if (user) {
    if (!user.favorites) {
      user.favorites = [];
    }

    const index = user.favorites.findIndex(fav => fav.imdbID === movie.imdbID);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(movie);
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    alert('Please log in to manage favorites');
  }
};

const isFavorite = (movie) => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user || !Array.isArray(user.favorites)) {
    return false;
  }

  return user.favorites.some(fav => fav.imdbID === movie.imdbID);
};
</script>
