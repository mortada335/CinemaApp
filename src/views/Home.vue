<template>
  <v-app app fixed>
    <v-app-bar fixed flat>
      <v-container>
        <v-form @submit.prevent="SearchMovies()" class="d-flex align-center fixed-search">
          <v-row align="center">
            <v-col cols="6" md="3">
              <v-text-field v-model="search" label="What are you looking for?" hide-details></v-text-field>
            </v-col>
            <!-- <v-col cols="auto"> -->
            <!-- <v-btn type="submit">Search</v-btn> -->
            <!-- </v-col> -->
          </v-row>
        </v-form>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row v-if="!searchActive">
          <v-col v-for="movie in initialMovies" :key="movie.imdbID" cols="12" sm="6" md="4">
            <v-card>
              <v-img :src="movie.Poster" height="400"></v-img>
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

        <v-row v-if="searchActive">
          <v-col v-for="movie in movies" :key="movie.imdbID" cols="12" sm="6" md="4">
            <v-card>
              <v-img :src="movie.Poster" height="200"></v-img>
              <v-card-title>{{ movie.Title }}</v-card-title>
              <v-card-subtitle>{{ movie.Year }}</v-card-subtitle>
              <v-card-actions>
                <v-btn :to="'/movie/' + movie.imdbID" text color="primary">Details</v-btn>
                <v-btn @click="toggleFavorite(movie)" :color="isFavorite(movie) ? 'red' : 'primary'">
                  {{ isFavorite(movie) ? 'Remove from Favorites' : 'Add to Favorites' }}
                </v-btn></v-card-actions>
            </v-card>
          </v-col>
        </v-row>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import { useRouter } from 'vue-router';
import env from '../env';

const search = ref('');
const movies = ref([]);
// const router = useRouter();
const searchActive = ref(false);
const initialMovies = ref([]);
const showMovies = ref(true);

const fetchInitialMovies = () => {
  fetch(`https://www.omdbapi.com/?apikey=${env.apikey}&s=action`).then(res => res.json()).then(data => {
    console.log(data);
    if (data.Search) {
      initialMovies.value = data.Search;
    }
  })
}

const SearchMovies = () => {
  if (search.value !== '') {
    fetch(`https://www.omdbapi.com/?apikey=${env.apikey}&s=${search.value}`)
      .then(res => res.json())
      .then(data => {
        if (data.Search) {
          movies.value = data.Search || [];
          searchActive.value = true;
          showMovies.value = false;
        }
        search.value = '';
      });
  }
};

onMounted(() => {
  fetchInitialMovies();
});

const toggleFavorite = (movie) => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (user) {
    let favorites = user.favorites || [];
    const index = favorites.findIndex(fav => fav.imdbID === movie.imdbID);
    if (index > -1) {
      favorites.splice(index, 1);
    }
    else {
      favorites.push(movie);
    }
    user.favorites = favorites;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
  else {
    alert('Please log in to manage Favorites')
  }

}


const isFavorite = (movie) => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  return user ? user.favorites.some(fav => fav.imdbID === movie.imdbID) : false;
};


</script>
