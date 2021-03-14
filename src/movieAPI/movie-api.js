/* eslint-disable camelcase */
import BuildFilmInfo from './build-film-info';

export default class MovieApi {
  buildFilm = new BuildFilmInfo().build

  constructor() {
    this.url = 'https://api.themoviedb.org/3';
    this.apiKey = 'api_key=5908be7961cd99390b32d8964c4435e7';
  }

  async getRequest(url) {
    const response = await fetch(url),
          result = await response.json();
    if (!response.ok) {
      throw new Error(`Can't ${url} because ${response.status}`);
    }
    return result;
  }

  async postRequest(url, rating = 0) {
    const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({ value: rating }),
          }),
          result = await response.json();
    if (!response.ok) {
      throw new Error(`Can't ${url} because ${response.status}`);
    }
    return result;
  }

  getGenreList() {
    return this.getRequest(
      `${this.url}/genre/movie/list?${this.apiKey}&language=en-US`,
    ).then(({ genres }) => genres.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {}));
  }

  async getMovies(filmName, page = 1) {
    const moviesList = await this.getRequest(
      `${this.url}/search/movie?${this.apiKey}&language=en-US&query=${filmName}&page=${page}&include_adult=false`,
    );
    return moviesList;
  }

  getMoviesLIst(filmName, page = 1) {
    return this.getMovies(filmName, page)
      .then(async ({ results, total_results }) => {
        const filmsList = await results.map((el) => this.buildFilm(el));
        return { filmsList, totalPages: total_results };
      });
  }

  async getGuestSessionID() {
    const res = await this.getRequest(
      `${this.url}/authentication/guest_session/new?${this.apiKey}`,
    );
    return res;
  }

  async postRateFilm(moveId, guestId, rating = 0) {
    const res = await this.postRequest(
      `${this.url}/movie/${moveId}/rating?${this.apiKey}&guest_session_id=${guestId}`,
      rating,
    );
    return res;
  }

  async getGuestFilmsList(guestId, page = 1) {
    const res = await this.getRequest(
      `${this.url}/guest_session/${guestId}/rated/movies?${this.apiKey}&page=${page}&language=en-US&sort_by=created_at.asc`,
    ).then(async ({ results, total_results }) => {
      const guestFilmsList = await results.map((el) => this.buildFilm(el));
      return { guestFilmsList, ratedTotalPages: total_results };
    });
    return res;
  }
}
