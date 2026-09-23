// Helper Functions
function DescriptionHandler(description) {
    return description.length > 70
        ? description.slice(0, 70) + "..."
        : description;
}

function titleHandler(title, maxLength = 15) {
    return title.length > maxLength
        ? title.slice(0, maxLength) + "..."
        : title;
}

function getGenres(genreIds = []) {

    return `
        <div class="badges-wrap">
            ${genreIds.map(id => `
                <span class="genre-badge fw-bold small px-3 py-1">
                    ${GenresId[id] ?? "Unknown"}
                </span>
            `).join("")}
        </div>
    `;
}



// Cards
function MovieCard(movie, index, genre,
    isWatchList = false) {

    return `
        <div class="col-12 col-sm-6 col-md-4 col-xl-3 mb-4 card-container">

            <div class="card" style="width: 18rem;">

                <div class="poster">

                    <img
                        src="${movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://placehold.co/500x750?text=No+Image"
        }"
                        class="card-img-top"
                        alt="${titleHandler(movie.title)}">

                        <div class="genres p-3 gap-3">
        <p title="${movie.title}" class="fw-bold fs-5 m-0 movie-text" style="cursor: pointer;" >${titleHandler(movie.title)}</p>
                            ${getGenres(movie.genre_ids)}


                            ${!isWatchList ? `
                                <button
                                    class="btn btn-sm btn-card-more fw-semibold mt-3 py-2 px-3 movie-text"
                                    onclick="fillPopup(${index},'${genre}')">
                                    <i class="fa-solid fa-circle-info me-2"></i> Details
                                </button>
                            ` : ""}
                        </div>

                </div>
                <div class="card-body">
                ${!isWatchList ? `

                    <h5 class="card-title fw-bold movie-text" title="${movie.title}" style="cursor: pointer;" onclick="fillPopup(${index},'${genre}')">
                        ${titleHandler(movie.title)}
                    </h5>

                        <p class="card-text movie-secondary">

                            ${DescriptionHandler(movie.overview)}

                            <span
                                class="description fw-bold movie-primary"
                                onclick="fillPopup(${index},'${genre}')">

                                See More...

                            </span>

                        </p>`: ""}

                    ${isWatchList ? `
                        <button
                            class="btn btn-sm btn-card-action is-added w-100 py-2 px-3 fw-bold movie-text"
                            onclick="toggleWatchList(${index},'${genre}')">
                            <i class="fa-solid fa-trash me-2"></i> Remove
                        </button>
                    `
            :
            `
                        <button
                            class="btn btn-sm btn-card-action btn-watchlist w-100 py-2 px-3 fw-bold movie-text"
                            data-movie-id="${movie.id}"
                            onclick="toggleWatchList(${index},'${genre}')">
                            <i class="fa-solid fa-bookmark me-2"></i> Add To WatchList
                        </button>
                    `
        }

                </div>

            </div>

        </div>
    `;
}

// Popups

function openPopup(selector) {
    if (selector === 'Login' || selector === 'Register') {
        FormHandler(selector);
        selector = 'Registeration';
    }

    $(`#${selector}`)
        .css("display", "flex")
        .hide()
        .fadeIn(300);
}

function closePopup() {
    $("#MovieDetails .banner").empty().css({ "height": "", "background-image": "", "display": "" });
    $("#MovieDetails iframe").remove();
    $(".popup").fadeOut(300);
}

$(document).on("click", ".popup", function (e) {
    if ($(e.target).hasClass("popup")) {
        closePopup();
    }
});

$(document).on("keydown", function (e) {
    if (e.key === "Escape") {
        closePopup();
    }
});

function playTrailer(trailerKey) {
    let isSmallScreen = window.innerWidth <= 576;

    if (isSmallScreen) {
        $("#TrailerContainer").html(`
            <div class="ratio ratio-16x9 rounded-3 overflow-hidden mt-3 shadow-lg border border-secondary">
                <iframe 
                    src="https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1" 
                    title="Movie Trailer" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen 
                    frameborder="0">
                </iframe>
            </div>
        `);
    } else {
        $(".banner")
            .css({
                "display": "block",
                "background-image": "none",
                "height": "250px"
            })
            .html(`
                <iframe 
                    src="https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1" 
                    title="Movie Trailer" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen 
                    frameborder="0"
                    style="width: 100%; height: 100%; border: none;">
                </iframe>
            `);

        $("#TrailerContainer").html(`
            <span class="badge bg-danger px-3 py-2 rounded-pill">
                <i class="fa-solid fa-circle-play me-1"></i> Playing Trailer Above
            </span>
        `);
    }
}

function fillPopup(index, genre) {
    let movie = MoviesALL[genre][index];
    if (!movie) return;

    let isSmallScreen = window.outerWidth <= 576;
    let popup = $('#MovieDetails .box');

    let hasBackdrop = movie.backdrop_path && !isSmallScreen;
    let bannerStyle = hasBackdrop
        ? `background-image: url('https://image.tmdb.org/t/p/w1280${movie.backdrop_path}');`
        : `display: none; height: 0;`;

    popup.html(`
        <div class="banner" style="${bannerStyle}"></div>

        <div class="content p-4">
            <button class="close-btn rounded-circle" onclick="closePopup()"><i class="fa-solid fa-xmark"></i></button>
            <div class="row g-4">
                <div class="col-sm-4 text-center posterContainer">
                    <img class="poster rounded-3" 
                         src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/500x750?text=No+Image'}" 
                         alt="${movie.title}">
                </div>
                <div class="col-sm-8">
                    <h2 class="movie-text fw-bold">${movie.title}</h2>
                    <div class="movie-info my-3">
                        <span><i class="fa-solid fa-star movie-gold me-1"></i> ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                        <span><i class="fa-solid fa-fire movie-red me-1"></i> ${Math.round(movie.popularity || 0)}</span>
                        <span><i class="fa-solid fa-globe movie-primary me-1"></i> ${(movie.original_language || 'EN').toUpperCase()}</span>
                        <span><i class="fa-regular fa-calendar-days movie-secondary me-1"></i> ${movie.release_date || 'Unknown'}</span>
                    </div>
                    <h5 class="movie-text fw-bold">Overview</h5>
                    <p class="overview movie-secondary">${movie.overview || 'No overview available.'}</p>
                    
                    <div id="TrailerContainer" class="mt-4">
                        <span class="movie-secondary"><i class="fa-solid fa-spinner fa-spin me-2"></i> Loading Trailer...</span>
                    </div>

                    <div id="CastContainer" class="mt-3"></div>
                </div>
            </div>
        </div>
    `);

    openPopup("MovieDetails");

    fetchMovieTrailer(movie.id, (trailerKey) => {
        let container = $("#TrailerContainer");
        if (trailerKey) {
            container.html(`
                <button class="btn btn-danger px-4 py-2 rounded-pill fw-bold" onclick="playTrailer('${trailerKey}')">
                    <i class="fa-brands fa-youtube me-2"></i> Watch Trailer
                </button>
            `);
        } else {
            container.html(`<span class="movie-secondary"><i class="fa-solid fa-video-slash me-2"></i> No Trailer Available</span>`);
        }
    });

    fetchMovieCast(movie.id, (cast) => {
        let castContainer = $("#CastContainer");
        if (cast && cast.length) {
            castContainer.html(`
                <h5 class="mt-4 mb-3 movie-text fw-bold">Top Cast</h5>
                <div class="cast-wrapper mt-3">
                    ${cast.map(actor => `
                        <div class="cast-card">
                            <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://placehold.co/200x300?text=No+Image'}" 
                                 class="cast-img" 
                                 alt="${actor.name}">
                            <p class="cast-name fw-bold small mt-1 mb-0 movie-text" title="${actor.name}">
                                ${actor.name}
                            </p>
                            <span class="cast-role small movie-secondary" title="${actor.character}">
                                ${actor.character || 'Actor'}
                            </span>
                        </div>
                    `).join("")}
                </div>
            `);
        } else {
            castContainer.empty();
        }
    });
}


// Auth Forms
function FormHandler(selector) {
    let form = $("#RegisterForm"),
        title = $("#Registeration .title");

    let isLogin = selector === "Login";
    title.text(isLogin ? "Login" : "Register");

    let LoginFields = [
        { id: 'UserName', label: 'Username', type: 'text', icon: 'fa-user', placeholder: 'Enter your username' },
        { id: 'Password', label: 'Password', type: 'password', icon: 'fa-lock', placeholder: 'Enter your password' }
    ];

    let RegisterFields = [
        { id: 'UserName', label: 'Username', type: 'text', icon: 'fa-user', placeholder: 'Enter your username' },
        { id: 'Email', label: 'Email Address', type: 'email', icon: 'fa-envelope', placeholder: 'Enter your email' },
        { id: 'Password', label: 'Password', type: 'password', icon: 'fa-lock', placeholder: 'Enter your password' },
        { id: 'ConfirmPassword', label: 'Confirm Password', type: 'password', icon: 'fa-lock', placeholder: 'Confirm your password' }
    ];

    let fields = isLogin ? LoginFields : RegisterFields;

    form.html(`
        ${fields.map(f => `
            <div class="mb-3 text-start">
                <label for="${f.id}" class="form-label movie-text small fw-semibold mb-1">${f.label}</label>
                <div class="input-group">
                    <span class="input-group-text movie-secondary">
                        <i class="fa-solid ${f.icon}"></i>
                    </span>
                    <input type="${f.type}" class="form-control" id="${f.id}" name="${f.id}" placeholder="${f.placeholder}" required autocomplete="${f.type === 'password' ? 'current-password' : 'off'}">
                </div>
            </div>
        `).join("")}

        <button type="submit" class="btn btn-auth w-100 rounded-pill py-2 mt-3 fw-bold shadow-sm">
            ${isLogin ? 'Log In' : 'Create Account'}
        </button>

        <p class="text-center movie-secondary small mt-3 mb-0">
            ${isLogin ? "Don't have an account?" : "Already have an account?"}
            <a href="#" class="movie-primary fw-bold text-decoration-none ms-1" onclick="openPopup('${isLogin ? 'Register' : 'Login'}')">
                ${isLogin ? 'Register' : 'Login'}
            </a>
        </p>
    `);
}

function updateUserMenu() {

    let user = currentUser(),
        menu = $(".dropdown-menu");

    if (user) {

        menu.html(`
            <li>
                <span class="dropdown-item-text movie-text fw-semibold px-3 py-2 d-block">
                    Hi, ${user.UserName}
                </span>
            </li>

            <li><hr class="dropdown-divider my-1"></li>

            <li>
                <a class="dropdown-item movie-red px-3 py-2" href="#" onclick="Logout()">
                    Logout
                </a>
            </li>
        `);

    } else {

        menu.html(`
            <li>
                <a class="dropdown-item movie-text px-3 py-2" href="#" onclick="openPopup('Register')">
                    Register
                </a>
            </li>

            <li>
                <a class="dropdown-item movie-text px-3 py-2" href="#" onclick="openPopup('Login')">
                    Login
                </a>
            </li>
        `);

    }
}

// WatchList


function getWatchList() {
    let user = currentUser();
    return user ? (user.WatchList || []) : [];
}

function saveWatchList(list) {

    let user = currentUser();

    if (!user) {
        customSwal.fire({
            icon: "warning",
            title: "Please log in to manage your watchlist.",
            showCancelButton: true,
            confirmButtonText: "Log In",
            cancelButtonText: "Register"
        }).then((result) => {
            if (result.isConfirmed) {
                openPopup("Login");
            } else if (result.dismiss === swal.DismissReason.cancel) {
                openPopup("Register");
            }
        });
        return false;
    }

    user.WatchList = list;

    saveCurrentUser(user);

    let users = JSON.parse(localStorage.getItem("Users")) || [];

    users = users.map(u =>
        u.UserName === user.UserName ? user : u
    );

    saveUsers(users);

    return true;
}

function updateWatchListCount() {

    let user = currentUser();

    if (!user) {
        $(".count-w")
            .text(0)
            .addClass("d-none");
        return;
    }

    let count = getWatchList().length;

    $(".count-w")
        .text(count)
        .toggleClass("d-none", count === 0);
}

function renderWatchList() {
    let user = currentUser();
    if (!user) {
        $("#WatchList .box").html(`
            <div class="text-center p-5">
                <h2 class="movie-text fw-bold">Please Login First</h2>
            </div>
        `);
        return;
    }
    let watchList = getWatchList();

    MoviesALL.WatchList = watchList;

    let container = $('#WatchList .box');

    if (!watchList.length) {

        container.html(`

        <div class="text-center p-5">

                <button
                    class="close-btn rounded-circle"
                    onclick="closePopup()">

                    <i class="fa-solid fa-xmark"></i>

                </button>
                <div class="title mb-4">
                    <h2 class="h2Title">WatchList</h2>
                </div>

                <p class="mt-4 movie-secondary fs-5">

                    Your WatchList is Empty

                </p>

            </div>

        `);

        return;

    }

    container.html(`

        <div class="container py-4">

            <button
                class="close-btn rounded-circle"
                onclick="closePopup()">

                <i class="fa-solid fa-xmark"></i>

            </button>
            <div class="title">
                <h2 class="h2Title">WatchList</h2>
            </div>

            <div class="row">

                ${watchList
            .map((movie, index) => MovieCard(movie, index, "WatchList", true))
            .join("")}

            </div>

        </div>

        `);

    ChangeButtonWatchList();

}

function ChangeButtonWatchList() {
    let watchList = getWatchList();

    $(".btn-watchlist").each(function () {
        let button = $(this),
            movieId = button.data("movie-id");

        if (watchList.some(movie => movie.id === movieId)) {
            button
                .html('<i class="fa-solid fa-trash me-2"></i> Remove')
                .addClass("is-added");
        }
        else {
            button
                .html('<i class="fa-solid fa-bookmark me-2"></i> Add To WatchList')
                .removeClass("is-added");
        }
    });
}

function toggleWatchList(index, genre) {

    let user = currentUser();

    if (!user) {
        customSwal.fire({
            icon: "warning",
            title: "Please log in to manage your watchlist.",
            showCancelButton: true,
            confirmButtonText: "Log In",
            cancelButtonText: "Register"
        }).then((result) => {
            if (result.isConfirmed) {
                openPopup("Login");
            } else if (result.dismiss === swal.DismissReason.cancel) {
                openPopup("Register");
            }
        });
        return;
    }

    let movie = MoviesALL[genre][index],
        watchList = getWatchList(),
        exists = watchList.some(item => item.id === movie.id);

    if (exists) {
        watchList = watchList.filter(item => item.id !== movie.id);
    } else {
        watchList.push(movie);
    }

    saveWatchList(watchList);

    updateWatchListCount();
    renderWatchList();
    ChangeButtonWatchList();
}

// Pagination
function loadMore(genre, page) {

    fetchMovies(genre, page, (response) => {

        let Movies = response.results,
            movieContainer =
                MoviesContainer.querySelector(`#pills-${GenresId[genre]} .row`);

        MoviesALL[GenresId[genre]] = Movies;

        movieContainer.innerHTML = Movies
            .map((movie, index) => MovieCard(movie, index, GenresId[genre]))
            .join("");

        movieContainer.innerHTML += `
            <nav aria-label="Page navigation example">
                <ul class="pagination">

                    ${Pagination(genre, page)}

                </ul>
            </nav>
        `;

    });

}

function Pagination(genre, currentPage = 1) {

    let html = "",

        totalPages = NumberOfPages[genre],

        start = Math.max(1, currentPage - 2),
        end = Math.min(totalPages, currentPage + 3);

    if (start > 1) {
        html += `
            <li class="page-item ${currentPage === 1 ? "active" : ""}">
                <a class="page-link"
                   href="#"
                   onclick="event.preventDefault(); loadMore(${genre}, 1)">
                    1
                </a>
            </li>`;
    }

    if (start > 2) {
        html += `
            <li class="page-item disabled">
                <span class="page-link">...</span>
            </li>`;
    }

    for (let i = start; i <= end; i++) {
        html += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link"
                   href="#"
                   onclick="event.preventDefault(); loadMore(${genre}, ${i})">
                    ${i}
                </a>
            </li>`;
    }

    if (end < totalPages - 1) {
        html += `
            <li class="page-item disabled">
                <span class="page-link">...</span>
            </li>`;
    }

    if (end < totalPages) {
        html += `
            <li class="page-item ${currentPage === totalPages ? "active" : ""}">
                <a class="page-link"
                   href="#"
                   onclick="event.preventDefault(); loadMore(${genre}, ${totalPages})">
                    ${totalPages}
                </a>
            </li>`;
    }

    return html;
}