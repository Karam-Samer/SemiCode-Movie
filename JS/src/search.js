// ================= Variables =================

let SearchResultsPage = $("#SearchResultsPage"),
    params = new URLSearchParams(window.location.search),
    query = params.get("query");

// ================= Search Results =================

if (query) {

    $("#SearchQuery").text(query);

    fetchMoviesBySearch(query, 1, (response) => {

        MoviesALL.Search = response.results || [];

        if (!MoviesALL.Search.length) {

            SearchResultsPage.html(`
                <div class="col-12 text-center">
                    <h2 class="text-danger">No results found</h2>
                </div>
            `);

        } else {

            SearchResultsPage.html(

                MoviesALL.Search
                    .map((movie, index) => MovieCard(movie, index, "Search"))
                    .join("")

            );

            ChangeButtonWatchList();

        }

    });

}


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