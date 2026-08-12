// ================= WOW.js =================

new WOW({
    animateClass: "animate__animated",
}).init();


// ================= Variables =================
let GenresUl = document.querySelector("#Movies .nav-pills"),
    MoviesContainer = document.querySelector("#Movies .tab-content"),
    Genres = ["Action", "Comedy", "Horror", "Romance", "Crime"],
    GenresNames = [28, 35, 27, 10749, 80],
    NumberOfPages = {};


// ================= User =================

updateUserMenu();

if (currentUser()) {
    updateWatchListCount();
    renderWatchList();
}

// ================= Genres =================

for (let i = 0; i < Genres.length; i++) {

    GenresUl.innerHTML += `
        <li class="nav-item" role="presentation">
            <button class="nav-link ${i === 0 ? "active" : ""}"
                id="pills-${Genres[i]}-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-${Genres[i]}"
                type="button"
                role="tab"
                aria-controls="pills-${Genres[i]}"
                aria-selected="${i === 0}">
                ${Genres[i]}
            </button>
        </li>
    `;

    MoviesContainer.innerHTML += `
        <div class="tab-pane fade ${i === 0 ? "show active" : ""}"
            id="pills-${Genres[i]}"
            role="tabpanel">

            <div class="row"></div>

        </div>
    `;
}

// ================= Movies =================

for (let i = 0; i < Genres.length; i++) {

    fetchMovies(GenresNames[i], 1, (response) => {

        let Movies = response.results;

        let movieContainer =
            MoviesContainer.querySelector(`#pills-${Genres[i]} .row`);

        movieContainer.innerHTML = Movies
            .map((movie, index) => MovieCard(movie, index, Genres[i]))
            .join("");

        movieContainer.innerHTML += `
            <nav>
                <ul class="pagination">
                    ${Pagination(GenresNames[i])}
                </ul>
            </nav>
        `;

        ChangeButtonWatchList();

    });

}

// ================= Search =================

let searchTimer;

searchInput.on("input", function () {

    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {

        let value = searchInput.val().trim();

        if (!value) {

            searchResults.empty().hide();
            MoviesALL.Search = [];
            return;

        }

        fetchMoviesBySearch(value, 1, (response) => {

            let Movies = response.results || [];

            MoviesALL.Search = Movies;

            if (!Movies.length) {

                searchResults
                    .html(`
                        <li class="search-result text-center p-2">
                            No results found
                        </li>
                    `)
                    .show();

                return;

            }

            Movies = Movies.slice(0, 5);

            searchResults.html(

                Movies.map((movie, index) => `

                    <li class="search-result p-2 gap-2"
                        onclick="fillPopup(${index},'Search')">

                        <img
                            src="${movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "images/no-image.png"}">

                        <div>

                            <h6 class="m-0">
                                ${titleHandler(movie.title)}
                            </h6>

                            <p>
                                ${movie.release_date || "Unknown Date"}
                            </p>

                        </div>

                    </li>

                `).join("")

            );

            searchResults.show();

        });

    }, 300);

});

$(document).on("click", function (e) {

    if (!$(e.target).closest("form").length) {
        searchResults.hide();
    }

});

searchInput.on("focus", function () {

    if (searchResults.children().length) {
        searchResults.show();
    }

});

searchBtn.on("click", function (e) {

    e.preventDefault();

    let value = searchInput.val().trim();

    if (!value) {

        swal.fire({
            icon: "warning",
            title: "Please enter a search term.",
            showConfirmButton: false,
            timer: 1500,
            theme: "dark",
        });
        return;

    }

    window.location.href =
        `SearchResult.html?query=${encodeURIComponent(value)}`;

});

// ================= WatchList =================

$("#WatchListBtn").on("click", function () {

    if (!currentUser()) {

        swal.fire({
            icon: "warning",
            title: "Please log in to view your watchlist.",
            showConfirmButton: true,
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonText: "Log In",
            cancelButtonText: "Register",
            theme: "dark",
        }).then((result) => {

            if (result.isConfirmed) {
                openPopup("Login");
            }
            else if (result.isDismissed) {
                openPopup("Register");
            }

        });
        return;

    }

    renderWatchList();
    openPopup("WatchList");

});


// ================= Trending =================

trendingMovies((response) => {

    let movies = response.results;

    let wrapper = document.querySelector("#Trending .swiper-wrapper");
    wrapper.innerHTML = movies.map((movie, index) => `

        <div class="swiper-slide">
            <div class="trending-card"
                onclick="fillPopup(${index},'Trending')">
                <div class="overflow-hidden">
                <img src="${movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "images/no-image.png"}">
            </div>
                <div class="trending-card-info">
                    <h6 class="m-0">
                        ${titleHandler(movie.title)}
                    </h6>
                    <p>
                        ${movie.release_date || "Unknown Date"}
                    </p>
                </div>
            </div>
        </div>

    `).join("");

    let swiper = new Swiper(".mySwiper", {
        slidesPerView: 5,
        spaceBetween: 20,
        loop: true,
        grabCursor: true,

        autoplay: {
            delay: 500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },

        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            992: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 5,
            },
        },
    });

});

