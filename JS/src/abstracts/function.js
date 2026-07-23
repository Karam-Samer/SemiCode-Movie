/*=== Helper Functions ===*/
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
                <span class="genre-badge">
                    ${GenresId[id] ?? "Unknown"}
                </span>
            `).join("")}
        </div>
    `;
}



/*=== Cards Functions ===*/
function MovieCard(movie, index, genre,
    isWatchList = false) {

    return `
        <div class="col-12 col-sm-6 col-md-4 col-xl-3 mb-4 card-container">

            <div class="card" style="width: 18rem;">

                <div class="poster">

                    <img
                        src="${movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "images/no-image.png"
        }"
                        class="card-img-top"
                        alt="${titleHandler(movie.title)}">

                        <div class="genres">
        <p title="${movie.title}" style="cursor: pointer;" >${titleHandler(movie.title)}</p>
                            ${getGenres(movie.genre_ids)}


                            ${!isWatchList ? `
                                <button
                                    class="btn btn-primary mt-3"
                                    onclick="fillPopup(${index},'${genre}')">
                                    See More...
                                </button>
                            ` : ""}
                        </div>

                </div>
                <div class="card-body">
                ${!isWatchList ? `

                    <h5 class="card-title" title="${movie.title}" style="cursor: pointer;" onclick="fillPopup(${index},'${genre}')">
                        ${titleHandler(movie.title)}
                    </h5>

                        <p class="card-text">

                            ${DescriptionHandler(movie.overview)}

                            <span
                                class="description"
                                onclick="fillPopup(${index},'${genre}')">

                                See More...

                            </span>

                        </p>`: ""}

                    ${isWatchList ? `
                        <button
                            class="btn btn-danger w-100"
                            onclick="toggleWatchList(${index},'${genre}')">

                            Remove

                        </button>
                    `
            :
            `
                        <button
                            class="btn btn-primary w-100 btn-watchlist"
                            data-movie-id="${movie.id}"
                            onclick="toggleWatchList(${index},'${genre}')">

                            Add To WatchList

                        </button>
                    `
        }

                </div>

            </div>

        </div>
    `;
}

function TrendingCard(movie) {

    return `
        <div class="swiper-slide">

            <div class="card">

                <img src="
                ${movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "images/no-image.png"}
                ">

                <h5>
                    ${titleHandler(movie.title)}
                </h5>

            </div>

        </div>
    `;
}

/*=== Popup Functions ===*/

function openPopup(selector) {
    if (selector === 'Login' || selector === 'Register') {
        FormHandler(selector);
        selector = 'Registeration';
    }
    console.log(selector);

    $(`#${selector} `)
        .css("display", "flex")
        .hide()
        .fadeIn(300);

}

function closePopup() {
    $(".popup").fadeOut(300);
}

function fillPopup(index, genre) {

    if (typeof searchResults !== "undefined") {
        searchResults.hide();
    }

    let movie = MoviesALL[genre][index],
        popup = $('#MovieDetails .box'),
        isSmallScreen = window.outerWidth <= 576;

    if (!movie) {
        return;
    }

    popup.html(`

            ${!isSmallScreen ? `
        <div class="banner"
            style="background-image: url('${
                movie.backdrop_path
                    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                    : "images/no-image.png"
            }')">
        </div>
    ` : ""}

        <div class="content">

            <button
                class="close-btn"
                onclick="closePopup()">

                <i class="fa-solid fa-xmark"></i>

            </button>

            <div class="row g-4">

                <div class="col-sm-4 text-center">

                    <img
                        class="poster"
                        src="${movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'images/no-image.png'
        }" alt="${titleHandler(movie.title)}">

                </div>

                <div class="col-sm-8">

                    <h2>${movie.title}</h2>

                    <div class="movie-info">

                        <span>
                            ⭐ ${movie.vote_average.toFixed(1)}
                        </span>

                        <span>
                            🔥 ${Math.round(movie.popularity)}
                        </span>

                        <span>
                            🌍 ${movie.original_language.toUpperCase()}
                        </span>

                        <span>
                            📅 ${movie.release_date}
                        </span>

                    </div>

                    <h5>Overview</h5>

                    <p class="overview">

                        ${movie.overview}

                    </p>

                </div>

            </div>

        </div>

    `);
    openPopup("MovieDetails");

}

/*=== Registration/Login Functions ===*/
function FormHandler(selector) {
    let form = $("#RegisterForm"),
        title = $("#Registeration .title");

    title.text(selector === "Login" ? "Login" : "Register");
    let Login = ['UserName', 'Password'],
        Register = ['UserName', 'Email', 'Password', 'ConfirmPassword'];
    if (selector === "Login") {
        form.html(`
            ${InputField(Login)}
            <button type="submit" class="btn btn-primary w-100">Login</button>
        `);
    }
    else {
        form.html(`
            ${InputField(Register)}
            <button type="submit" class="btn btn-primary w-100">Register</button>
        `);
    }
}

function updateUserMenu() {

    let user = currentUser(),
        menu = $(".dropdown-menu");

    if (user) {

        menu.html(`
            <li>
                <span class="dropdown-item-text">
                    Hi, ${user.UserName}
                </span>
            </li>

            <li><hr class="dropdown-divider"></li>

            <li>
                <a class="dropdown-item" href="#" onclick="Logout()">
                    Logout
                </a>
            </li>
        `);

    } else {

        menu.html(`
            <li>
                <a class="dropdown-item" href="#" onclick="openPopup('Register')">
                    Register
                </a>
            </li>

            <li>
                <a class="dropdown-item" href="#" onclick="openPopup('Login')">
                    Login
                </a>
            </li>
        `);

    }
}

function InputField(fields) {
    return fields.map(field => {
        return `<div class="mb-3">
            <label for="${field}" class="form-label">${field}</label>
            <input type="${field === 'Password' || field === 'ConfirmPassword' ? 'password' :
                field === 'Email' ? 'email' : 'text'
            }" class="form-control" id="${field}" placeholder="${field}" name="${field}" required>
        </div>`;
    }).join("");
}

/*=== WatchList Functions ===*/


function getWatchList() {
    let user = currentUser();
    return user ? (user.WatchList || []) : [];
}

function saveWatchList(list) {

    let user = currentUser();

    if (!user) {
        alert("Please Login First");
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
                <h2>Please Login First</h2>
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
                    class="close-btn"
                    onclick="closePopup()">

                    <i class="fa-solid fa-xmark"></i>

                </button>
                <div class="title">
                    <h2 class="h2Title">WatchList</h2>
                </div>

                <p class="mt-4">

                    Your WatchList is Empty

                </p>

            </div>

        `);

        return;

    }

    container.html(`

        <div class="container py-4">

            <button
                class="close-btn"
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
                .text("Remove from WatchList")
                .removeClass("btn-primary")
                .addClass("btn-danger");
        }
        else {
            button
                .text("Add to WatchList")
                .removeClass("btn-danger")
                .addClass("btn-primary");
        }
    });
}

function toggleWatchList(index, genre) {

    let user = currentUser();

    if (!user) {
        alert("Please Login First");
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

/*=== Pages Functions ===*/
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