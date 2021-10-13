export class API {
    _key;
    constructor(key) {
        this._key = key;
    }

    search(query_str) {
        // return list of responces
        return this.#get_responce(this.#parse_query(query_str));
    }


    #get_responce(query) {
        let url = "https://api.themoviedb.org/3/search/movie?api_key=" + this._key;
        return fetch(url + "&query=" + query)
            .then((responce) => {
                // console.log(responce.json());
                return responce.json();
            })
            .catch((e) => console.log(e));
    }

    #parse_query(query_str) {
        let result = query_str.trim().replaceAll(" ", "+");
        return result;
    }
}