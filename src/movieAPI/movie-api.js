/* eslint-disable camelcase */
import movieServiceApi from './movie-service-api';
import BuildFilmInfo from './build-film-info';

export default class MovieApi extends movieServiceApi {
  buildFilm = new BuildFilmInfo().build

  async getMovies(filmName, page = 1) {
    return this.getRequest(
      `${this.url}/search/movie?${this.apiKey}&language=en-US&query=${filmName}&page=${page}&include_adult=false`,
    );
  }

  getMoviesLIst(filmName, page = 1) {
    return this.getMovies(filmName, page)
      .then(async ({ results, total_results }) => {
        const filmsList = await results.map((el) => this.buildFilm(el));
        return { filmsList, totalPages: total_results };
      });
  }
}
