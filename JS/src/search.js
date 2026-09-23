// Search Module

let searchTimer;

function performSearch(value) {
    if (!value) {
        customSwal.fire({
            icon: "warning",
            title: "Please enter a search term.",
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }

    searchResults.hide();
    $("#SearchQuery").text(value);
    $("#SearchResultsPage").html(`
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 movie-text">Searching movies...</p>
        </div>
    `);

    openPopup("SearchResultsPopup");

    fetchMoviesBySearch(value, 1, (response) => {
        let movies = response.results || [];
        MoviesALL.Search = movies;

        if (!movies.length) {
            $("#SearchResultsPage").html(`
                <div class="col-12 text-center py-5">
                    <h3 class="movie-red mb-2">No results found for "${value}"</h3>
                    <p class="movie-secondary">Try searching with different keywords</p>
                </div>
            `);
            return;
        }

        $("#SearchResultsPage").html(
            movies.map((movie, index) => MovieCard(movie, index, "Search")).join("")
        );

        ChangeButtonWatchList();
    });
}

searchInput.on("input", function () {
    clearTimeout(searchTimer);

    let value = $(this).val().trim();

    if (!value) {
        searchResults.empty().hide();
        MoviesALL.Search = [];
        return;
    }

    searchResults.html(`
        <li class="search-result text-center p-3 movie-secondary">
            <i class="fa-solid fa-spinner fa-spin me-2"></i> Searching...
        </li>
    `).show();

    searchTimer = setTimeout(() => {
        fetchMoviesBySearch(value, 1, (response) => {
            let movies = response.results || [];

            if (!movies.length) {
                searchResults.html(`
                    <li class="search-result text-center p-3 movie-secondary">
                        <i class="fa-solid fa-circle-exclamation me-2 movie-gold"></i> No movies found
                    </li>
                `).show();
                return;
            }

            movies = movies.slice(0, 5);
            MoviesALL.Search = movies;

            searchResults.html(
                movies.map((movie, index) => `
                    <li class="search-result p-2 d-flex align-items-center gap-3"
                        onclick="fillPopup(${index}, 'Search'); searchResults.hide();">
                        <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'https://placehold.co/200x300?text=No+Image'}" 
                             alt="${movie.title}" 
                             class="rounded">
                        <div class="search-info overflow-hidden">
                            <h6 class="m-0 text-truncate movie-text fw-bold">${titleHandler(movie.title, 25)}</h6>
                            <div class="d-flex align-items-center gap-2 mt-1">
                                <span class="movie-gold small"><i class="fa-solid fa-star me-1"></i>${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                                <span class="movie-secondary small"><i class="fa-regular fa-calendar me-1"></i>${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
                            </div>
                        </div>
                    </li>
                `).join("")
            ).show();
        });
    }, 300);
});

searchInput.on("focus", function () {
    if (searchResults.children().length) {
        searchResults.show();
    }
});

searchInput.on("keydown", function (e) {
    if (e.key === "Escape") {
        searchResults.hide();
    }
});

$(document).on("click", function (e) {
    if (!$(e.target).closest("form[role='search']").length && !$(e.target).closest("#SearchResults").length) {
        searchResults.hide();
    }
});

searchBtn.on("click", function (e) {
    e.preventDefault();
    performSearch(searchInput.val().trim());
});

$("form[role='search']").on("submit", function (e) {
    e.preventDefault();
    performSearch(searchInput.val().trim());
});