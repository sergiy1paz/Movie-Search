export class ResponceProcessor {
    _api;
    constructor(api) {
        this._api = api;
    }    

    get_movies(movie_name) {
        return this.#parse(this._api.search(movie_name));
    }

    test(movie_name) {
        this._api.search(movie_name).then(res => console.log(res));
    }

    #parse(responce) {
        return responce.then(res => {
            const movies = [];
            for (const result of res.results) {

                if (result.release_date) {
                    movies.push({
                        id: result.id,
                        title: result.title,
                        language: result.original_language,
                        popularity: result.popularity,
                        number_of_vote: result.vote_count,
                        rating: result.vote_average,
                        release_date: result.release_date
                    });
                }
            }
    
            return movies;
        });
    }
}