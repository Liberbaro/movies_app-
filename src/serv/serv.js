export default class Serv {
  constructor() {
    this.url = 'https://api.themoviedb.org/3/';
    this.apiKey = 'api_key=5908be7961cd99390b32d8964c4435e7';
    this.itemKey = 1;
  }

  async getResp(url) {
    const res = await fetch(url),
          result = await res.json();
    if (!res.ok) {
      throw new Error(`Can't ${url} because ${res.status}`);
    }
    return result;
  }

  async getMoviesList(filmName, page) {
    const movies = await this.getResp(
      `${this.url}search/movie?${this.apiKey}&language=en-US&query=${filmName}&page=${page}&include_adult=false`,
    );
    return movies.results;
  }

  getDataFilm(filmName) {
    return this.getMoviesList(filmName, 1).then((res) => res.map((el) => {
      const newEl = {
        overview: el.overview,
        releaseDate: el.release_date,
        raiting: el.vote_average,
        title: el.title,
        poster: el.poster_path,
        genre: el.genre_ids,
        key: this.itemKey++,
      };
      return newEl;
    }));
  }
}
