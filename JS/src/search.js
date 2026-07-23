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