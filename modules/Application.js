import { API } from "./API.js";
import { ResponceProcessor } from "./ResponceProcesser.js";
import { API_KEY } from "./AppConfig.js";

export class Application {
    // #movie_name;
    #processor;
    #movies_list;

    constructor() {
        this.#processor = new ResponceProcessor(new API(API_KEY));
    }

    init() {
        document.getElementById("btnSearch").addEventListener("click", (e) => {
            const edText = document.getElementById("edText");
            if (edText) {
                const movie_name = edText.value;
                if (movie_name) {
                    // here delete active arrow classes 
                    this.#deactivate_arrows();

                    this.#movies_list = this.#processor.get_movies(movie_name);
                    this.#movies_list.then(list => this.#render(list));
                    // this.#processor.test(movie_name);


                }
            }
        });

        // here i must init all column headers
        this.#init_headers();
    }

    #deactivate_arrows(without_id=null) {
        const table_headers = document.querySelectorAll("thead th.th_hover");
        for (const header of table_headers) {
            if (header.id !== without_id) {
                const spans = header.querySelectorAll("span");
                for (const span of spans) {
                    span.classList.remove("active-arrow");
                }
            }
        }
    }
    #init_headers() {
        const table_headers = document.querySelectorAll(".th_hover");
        for (const header of table_headers) {
            header.addEventListener("click", (e) => {
                const currentTarget = e.currentTarget;
                this.#deactivate_arrows(currentTarget.id);

                const spans = currentTarget.querySelectorAll("span");
                const [up, down] = spans;
                const activeArrowClass = "active-arrow";
                if (up.classList.contains(activeArrowClass)) {
                    up.classList.remove(activeArrowClass);
                    down.classList.add(activeArrowClass);
                    // sort by decsending
                    this.#sort("desc", currentTarget.id);
                } else if (down.classList.contains(activeArrowClass)) {
                    down.classList.remove(activeArrowClass);
                    // without sort
                    // this.#sort_list(null);
                    this.#sort(null);
                } else {
                    up.classList.add(activeArrowClass);
                    // sort by ascending
                    this.#sort("asc", currentTarget.id);
                }
            });



        }
    }

    #sort(sorting_type, header_id) {
        let comparer = null;

        if (header_id === "release_date") {
            if (sorting_type === "asc") {
                comparer = (a, b) => new Date(b[header_id]) - new Date(a[header_id]);
            } else if (sorting_type === "desc") {
                comparer = (a, b) => new Date(a[header_id]) - new Date(b[header_id]);
            }
        } else {
            if (sorting_type === "asc") {
                comparer = (a, b) => b[header_id] - a[header_id];
            } else if (sorting_type === "desc") {
                comparer = (a, b) => a[header_id] - b[header_id];
            }
        }

        this.#sort_list(comparer);
    }


    #sort_list(comparer) {
        if (this.#movies_list) {
            this.#movies_list = this.#movies_list.then(list => {
                if (list.length > 1) {
                    // sort
                    let newList = list.slice(0);
                    if (comparer !== null) {
                        newList = newList.sort(comparer);
                    }
                    // end of sorting
                    this.#render(newList);
                    return list;
                }
            })
        }
    }

    #render(list) {
        const tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (const movie of list) {
            tbody.appendChild(this.#create_ui_row(movie));
        }
    }

    #create_ui_row(movie) {
        const { id, title, language, popularity, number_of_vote, rating, release_date } = movie;

        const row = document.createElement("tr");
        const id_th = document.createElement("th");
        // id_th.scope = "row";
        id_th.innerText = id;
        row.appendChild(id_th);

        const title_td = document.createElement("td");
        title_td.innerText = title;
        row.appendChild(title_td);

        // add for else

        const lang_td = document.createElement("td");
        lang_td.innerText = language;
        row.appendChild(lang_td);

        const popularity_td = document.createElement("td");
        popularity_td.innerText = popularity;
        row.appendChild(popularity_td);

        const number_of_votes_td = document.createElement("td");
        number_of_votes_td.innerText = number_of_vote;
        row.appendChild(number_of_votes_td);

        const rating_td = document.createElement("td");
        rating_td.innerText = rating;
        row.appendChild(rating_td);

        const release_date_td = document.createElement("td");
        release_date_td.innerText = release_date;
        row.appendChild(release_date_td);

        return row;
    }
}