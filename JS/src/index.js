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
        <li class="nav-item m-1" role="presentation">
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

let loadedGenres = 0;

for (let i = 0; i < Genres.length; i++) {
  fetchMovies(GenresNames[i], 1, (response) => {
    let Movies = response.results;

    let movieContainer = MoviesContainer.querySelector(
      `#pills-${Genres[i]} .row`,
    );

    movieContainer.innerHTML = Movies.map((movie, index) =>
      MovieCard(movie, index, Genres[i]),
    ).join("");

    movieContainer.innerHTML += `
            <nav>
                <ul class="pagination">
                    ${Pagination(GenresNames[i])}
                </ul>
            </nav>
        `;

    ChangeButtonWatchList();

    loadedGenres++;
    if (loadedGenres === Genres.length) {
      completeHeroCarousel();
    }
  });
}

// ================= WatchList =================

$("#WatchListBtn").on("click", function () {
  if (!currentUser()) {
    customSwal
      .fire({
        icon: "warning",
        title: "Please log in to view your watchlist.",
        showCancelButton: true,
        confirmButtonText: "Log In",
        cancelButtonText: "Register",
      })
      .then((result) => {
        if (result.isConfirmed) {
          openPopup("Login");
        } else if (result.dismiss === swal.DismissReason.cancel) {
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
  wrapper.innerHTML = movies
    .map(
      (movie, index) => `

        <div class="swiper-slide">
            <div class="trending-card"
                onclick="fillPopup(${index},'Trending')">
                <div class="overflow-hidden">
                <img src="${
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://placehold.co/500x750?text=No+Image"
                }">
            </div>
                <div class="trending-card-info p-3">
                    <h6 class="m-0 movie-text">
                        ${titleHandler(movie.title)}
                    </h6>
                    <p class="m-0 mt-1 small movie-secondary">
                        ${movie.release_date || "Unknown Date"}
                    </p>
                </div>
            </div>
        </div>

    `,
    )
    .join("");

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

// ================= Page Loader Popup =================
openPopup("Loader");

function hideLoader() {
  $("#Loader").fadeOut(600, function () {
    new WOW({
      animateClass: "animate__animated",
    }).init();
  });
}

if (document.readyState === "complete") {
  setTimeout(hideLoader, 2500);
} else {
  window.addEventListener("load", () => {
    setTimeout(hideLoader, 2500);
  });
}

// ================= Carousel =================
function completeHeroCarousel() {
  let carousel = $("#hero .carousalKA-inner");
  const allMovies = Object.values(MoviesALL).flat();

  const randomMovies = allMovies
    .filter((movie) => movie.backdrop_path)
    .sort(() => Math.random() - 0.5)
    .slice(0, 15);
  carousel.html(
    randomMovies
      .map(
        (movie) => `
       <div class="swiper-slide">
            <div class="movie-card">
                <div class="image-container">
                    <img src="https://image.tmdb.org/t/p/w500/${movie.backdrop_path}" alt="${movie.title}">
                </div>
            </div>
          </div>
      `,
      )
      .join(""),
  );

  let swiper = new Swiper(".carousalKA", {
    slidesPerView: 5,
    spaceBetween: 20,
    slidesPerGroup: 1,
    loopedSlides: 5,
    loop: true,
    grabCursor: false,
    allowTouchMove: false,

    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },
    on: {
      slideChangeTransitionEnd: function () {
        let activeIndex = this.realIndex,
          movie = randomMovies[activeIndex],
          $image = $("#hero .hero-transition-image"),
          $activeContainer = $(this.slides[this.activeIndex]).find(
            ".image-container"
          );

        let rect = $activeContainer[0].getBoundingClientRect();
        let heroRect = $("#hero")[0].getBoundingClientRect();

        $image
          .attr("src", `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`)
          .css({
            left: rect.left - heroRect.left,
            top: rect.top - heroRect.top,
            width: rect.width,
            height: rect.height,
          })
          .removeClass("active");

        void $image[0].offsetWidth;

        $image.addClass("active");

        setTimeout(() => {
          const $heroBg = $("#hero .hero-bg");

          $heroBg
            .css(
              "background-image",
              `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            )
            .removeClass("hero-bg-animation");
            
          void $heroBg[0].offsetWidth;

          $heroBg.addClass("hero-bg-animation");
          $image.attr("src", "");
        }, 700);
      },
    },
  });
}
