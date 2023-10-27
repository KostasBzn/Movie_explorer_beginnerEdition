const apiKey = "47a3d7177c8cbf56872ab7cc1463cea5";
const movieList = document.querySelector(".movie_list");
const searchButton = document.querySelector(".submit_button");
const searchInput = document.getElementById("search");
const pagesButtons = document.querySelector(".pages_buttons");
const pagesCounter = document.querySelector(".page_count");
const nextPage = document.querySelector(".next_page");
const previousPage = document.querySelector(".previous_page");
const pageInformation = document.querySelector(".page_manipulation");
const toggleSection = document.querySelector(".toggle_section");
const upcomingList = document.querySelector(".upcoming_list");
const trendingList = document.querySelector(".trending_list");
const topRatedList = document.querySelector(".top-rated_list");
const favoriteList = document.querySelector(".favorite-movies_list");
const favoriteSection = document.querySelector(".favorite-movies");

let currentPage = 1;
let searchMovie = "";

function goToNextPage() {
  if (currentPage < 10) {
    currentPage++;
    fetchMovieData(currentPage);
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }
}

function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchMovieData(currentPage);
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  }
}

function openToggle() {
  toggleSection.style.display = "block";
}

function closeToggle() {
  toggleSection.style.display = "none";
}

searchButton.addEventListener("click", () => {
  searchMovie = searchInput.value.trim();
  fetchMovieData(currentPage);
});

previousPage.addEventListener("click", goToPreviousPage);
nextPage.addEventListener("click", goToNextPage);

function fetchMovieData(page) {
  if (searchMovie !== "") {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      searchMovie
    )}&api_key=${apiKey}&page=${page}`;

    //fetching the results
    fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => {
        //log the results for helping understand the structure
        console.log(data);

        movieList.innerHTML = "";

        //display eah result
        data.results.forEach((movie) => {
          const resultsLi = document.createElement("li");

          resultsLi.innerHTML = `
          <button class="favorite"><i class="fa-solid heart-solid fa-heart"></i><i class="fa-regular heart-empty fa-heart"></i></button>
          <p><b>Rating:</b> ${movie.vote_average.toFixed(2)}</p>
          <p><b>Release Date:</b> ${movie.release_date}</p></div>
          <img class="logo" src="https://image.tmdb.org/t/p/w500${
            movie.poster_path
          }" alt="${movie.title}"> 
          <button class="details_button" movie_id="${
            movie.id
          }">More details</button>
      
          `;

          //add them in the li element
          movieList.appendChild(resultsLi);

          //passing the id to the details button
          const detailsButton = resultsLi.querySelector(".details_button");
          detailsButton.addEventListener("click", movieDetails);

          //Favourite Button function, Local storage
          const favoriteBtn = resultsLi.querySelector(".favorite");
          favoriteBtn.addEventListener("click", favorite);

          function favorite() {
            const heartFilled = favoriteBtn.querySelector(".heart-solid");
            const heartEmpty = favoriteBtn.querySelector(".heart-empty");
            if (heartFilled.style.display === "block") {
              heartFilled.style.display = "none";
              heartEmpty.style.display = "block";
            } else {
              heartFilled.style.display = "block";
              heartEmpty.style.display = "none";
            }
          }
        });

        // function for fetching details called with details button
        function movieDetails(e) {
          const movieId = e.target.getAttribute("movie_id");
          function fetchMovieDetails(id) {
            const detailUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}
            `;
            fetch(detailUrl)
              .then((response) => response.json())
              .then((data) => {
                //log the details for helping understand the structure
                console.log(data);

                //content
                toggleSection.innerHTML = `
                <h2>${data.title}</h2>
                <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title}">
                <p><b>Overview:</b> ${data.overview}</p>
                <p><b>Release Date:</b> ${data.release_date}</p>
                <p><b>Language:</b> ${data.spoken_languages[0].name}</p>
                <p><b>Duration:</b> ${data.runtime} minutes</p>
                <p><b>Type:</b> ${data.genres[0].name}</p>
                <button class="close_toggle"><i class="fa-solid fa-square-xmark"></i></button>`;

                //function to open the toggle section
                openToggle();
                const closeToggleBtn = document.querySelector(".close_toggle");
                closeToggleBtn.addEventListener("click", closeToggle);
              });
          }
          fetchMovieDetails(movieId);
        }
        //display the page information only after search
        pageInformation.style.display = "flex";

        pagesCounter.innerHTML = `
          <p><b>Current page:</b> ${data.page}</p>
          <p><b>Total results:</b> ${data.total_results}</p>
          `;
      })

      .catch((error) => {
        alert("Error fetching the data", error);
      });
  } else alert("Please give a movie name");
  searchInput.value = "";
}

function upcoming() {
  fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (i = 0; i < 7; i++) {
        const movie = data.results[i];
        const resultsLi = document.createElement("li");
        resultsLi.innerHTML = `
        <button class="favorite"><i class="fa-solid heart-solid fa-heart"></i><i class="fa-regular heart-empty fa-heart"></i></button>
          <p><b>Rating:</b> ${movie.vote_average.toFixed(2)}</p>
          <p><b>Release Date:</b> ${movie.release_date}</p></div>
          <img class="logo" src="https://image.tmdb.org/t/p/w500${
            movie.poster_path
          }" alt="${movie.title}"> 
          <button class="details_button" movie_id="${
            movie.id
          }">More details</button>
      
          `;

        upcomingList.appendChild(resultsLi);
        //passing the id to the details button
        const detailsButton = resultsLi.querySelector(".details_button");
        detailsButton.addEventListener("click", movieDetails);

        //Favourite Button function, Local storage
        const favoriteBtn = resultsLi.querySelector(".favorite");
        favoriteBtn.addEventListener("click", favorite);

        function favorite() {
          const heartFilled = favoriteBtn.querySelector(".heart-solid");
          const heartEmpty = favoriteBtn.querySelector(".heart-empty");
          if (heartFilled.style.display === "block") {
            heartFilled.style.display = "none";
            heartEmpty.style.display = "block";
          } else {
            heartFilled.style.display = "block";
            heartEmpty.style.display = "none";
          }
        }
      }

      function movieDetails(e) {
        const movieId = e.target.getAttribute("movie_id");
        function fetchMovieDetails(id) {
          const detailUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}
          `;
          fetch(detailUrl)
            .then((response) => response.json())
            .then((data) => {
              //log the details for helping understand the structure
              console.log(data);

              //content
              toggleSection.innerHTML = `
              <h2>${data.title}</h2>
              <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title}">
              <p><b>Overview:</b> ${data.overview}</p>
              <p><b>Release Date:</b> ${data.release_date}</p>
              <p><b>Language:</b> ${data.spoken_languages[0].name}</p>
              <p><b>Duration:</b> ${data.runtime} minutes</p>
              <p><b>Type:</b> ${data.genres[0].name}</p>
              <button class="close_toggle"><i class="fa-solid fa-square-xmark"></i></button>`;

              //function to open the toggle section
              openToggle();
              const closeToggleBtn = document.querySelector(".close_toggle");
              closeToggleBtn.addEventListener("click", closeToggle);
            });
        }
        fetchMovieDetails(movieId);
      }
    })
    .catch((error) => {
      console.error("Error fetching upcoming movies:", error);
    });
}

function trending() {
  fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (i = 0; i < 7; i++) {
        const movie = data.results[i];
        const resultsLi = document.createElement("li");
        resultsLi.innerHTML = `
        <button class="favorite"><i class="fa-solid heart-solid fa-heart"></i><i class="fa-regular heart-empty fa-heart"></i></button>
          <p><b>Rating:</b> ${movie.vote_average.toFixed(2)}</p>
          <p><b>Release Date:</b> ${movie.release_date}</p></div>
          <img class="logo" src="https://image.tmdb.org/t/p/w500${
            movie.poster_path
          }" alt="${movie.title}"> 
          <button class="details_button" movie_id="${
            movie.id
          }">More details</button>
      
          `;

        trendingList.appendChild(resultsLi);
        //passing the id to the details button
        const detailsButton = resultsLi.querySelector(".details_button");
        detailsButton.addEventListener("click", movieDetails);

        //Favourite Button function, Local storage
        const favoriteBtn = resultsLi.querySelector(".favorite");
        favoriteBtn.addEventListener("click", favorite);

        function favorite() {
          //favourite list
          let favoriteMovies = [];
          const movieId = detailsButton.getAttribute("movie_id");
          const favMovie = data.results.find((m) => m.id === parseInt(movieId));

          localStorage.setItem("savedMovie", JSON.stringify(favMovie));

          const savedMovie = JSON.parse(localStorage.getItem("savedMovie"));

          favoriteList.innerHTML = `
          <button class="favorite"><i class="fa-solid heart-solid fa-heart"></i><i class="fa-regular heart-empty fa-heart"></i></button>
            <p><b>Rating:</b> ${savedMovie.vote_average.toFixed(2)}</p>
            <p><b>Release Date:</b> ${savedMovie.release_date}</p></div>
            <img class="logo" src="https://image.tmdb.org/t/p/w500${
              savedMovie.poster_path
            }" alt="${savedMovie.title}"> 
            <button class="details_button" movie_id="${
              savedMovie.id
            }">More details</button>
        
            `;

          favoriteSection.style.display = "block";

          const heartFilled = favoriteBtn.querySelector(".heart-solid");
          const heartEmpty = favoriteBtn.querySelector(".heart-empty");
          if (heartFilled.style.display === "block") {
            heartFilled.style.display = "none";
            heartEmpty.style.display = "block";
          } else {
            heartFilled.style.display = "block";
            heartEmpty.style.display = "none";
          }
        }
      }

      function movieDetails(e) {
        const movieId = e.target.getAttribute("movie_id");
        function fetchMovieDetails(id) {
          const detailUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}
          `;
          fetch(detailUrl)
            .then((response) => response.json())
            .then((data) => {
              //log the details for helping understand the structure
              console.log(data);

              //content
              toggleSection.innerHTML = `
              <h2>${data.title}</h2>
              <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title}">
              <p><b>Overview:</b> ${data.overview}</p>
              <p><b>Release Date:</b> ${data.release_date}</p>
              <p><b>Language:</b> ${data.spoken_languages[0].name}</p>
              <p><b>Duration:</b> ${data.runtime} minutes</p>
              <p><b>Type:</b> ${data.genres[0].name}</p>
              <button class="close_toggle"><i class="fa-solid fa-square-xmark"></i></button>`;

              //function to open the toggle section
              openToggle();
              const closeToggleBtn = document.querySelector(".close_toggle");
              closeToggleBtn.addEventListener("click", closeToggle);
            });
        }
        fetchMovieDetails(movieId);
      }
    })
    .catch((error) => {
      console.error("Error fetching trending movies:", error);
    });
}

function topRated() {
  fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      for (i = 0; i < 7; i++) {
        const movie = data.results[i];
        const resultsLi = document.createElement("li");
        resultsLi.innerHTML = `
        <button class="favorite"><i class="fa-solid heart-solid fa-heart"></i><i class="fa-regular heart-empty fa-heart"></i></button>
          <p><b>Rating:</b> ${movie.vote_average.toFixed(2)}</p>
          <p><b>Release Date:</b> ${movie.release_date}</p></div>
          <img class="logo" src="https://image.tmdb.org/t/p/w500${
            movie.poster_path
          }" alt="${movie.title}"> 
          <button class="details_button" movie_id="${
            movie.id
          }">More details</button>
      
          `;

        topRatedList.appendChild(resultsLi);
        //passing the id to the details button
        const detailsButton = resultsLi.querySelector(".details_button");
        detailsButton.addEventListener("click", movieDetails);

        //Favorite Button function, Local storage
        const favoriteBtn = resultsLi.querySelector(".favorite");
        favoriteBtn.addEventListener("click", favorite);

        function favorite() {
          const heartFilled = favoriteBtn.querySelector(".heart-solid");
          const heartEmpty = favoriteBtn.querySelector(".heart-empty");
          if (heartFilled.style.display === "block") {
            heartFilled.style.display = "none";
            heartEmpty.style.display = "block";
          } else {
            heartFilled.style.display = "block";
            heartEmpty.style.display = "none";
          }
        }
      }

      function movieDetails(e) {
        const movieId = e.target.getAttribute("movie_id");
        function fetchMovieDetails(id) {
          const detailUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}
          `;
          fetch(detailUrl)
            .then((response) => response.json())
            .then((data) => {
              //log the details for helping understand the structure
              console.log(data);

              //content
              toggleSection.innerHTML = `
              <h2>${data.title}</h2>
              <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title}">
              <p><b>Overview:</b> ${data.overview}</p>
              <p><b>Release Date:</b> ${data.release_date}</p>
              <p><b>Language:</b> ${data.spoken_languages[0].name}</p>
              <p><b>Duration:</b> ${data.runtime} minutes</p>
              <p><b>Type:</b> ${data.genres[0].name}</p>
              <button class="close_toggle"><i class="fa-solid fa-square-xmark"></i></button>`;

              //function to open the toggle section
              openToggle();
              const closeToggleBtn = document.querySelector(".close_toggle");
              closeToggleBtn.addEventListener("click", closeToggle);
            });
        }
        fetchMovieDetails(movieId);
      }
    })
    .catch((error) => {
      console.error("Error fetching top rated movies:", error);
    });
}

upcoming();
trending();
topRated();

let favoriteMovies = [];
