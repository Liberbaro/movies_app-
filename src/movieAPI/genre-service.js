import movieServiceApi from './movie-service-api';

export default class GenreService extends movieServiceApi {
  getGenreList() {
    return this.getRequest(`${this.url}/genre/movie/list?${this.apiKey}&language=en-US`)
      .then(({ genres }) => genres.reduce((acc, { id, name }) => ({ ...acc, [id]: name }), {}));
  }
}
