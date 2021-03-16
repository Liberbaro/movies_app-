import movieServiceApi from './movie-service-api';
import BuildFilmInfo from './build-film-info';

export default class GuestSessionService extends movieServiceApi {
  buildFilm = new BuildFilmInfo().build

  async getGuestSessionID() {
    return this.getRequest(`${this.url}/authentication/guest_session/new?${this.apiKey}`);
  }

  async getGuestFilmsList(guestId, page = 1) {
    const res = await this.getRequest(
      `${this.url}/guest_session/${guestId}/rated/movies?${this.apiKey}&page=${page}&language=en-US&sort_by=created_at.asc`,
      // eslint-disable-next-line camelcase
    ).then(async ({ results, total_results }) => {
      const guestFilmsList = await results.map((el) => this.buildFilm(el));
      return { guestFilmsList, ratedTotalPages: total_results };
    });
    return res;
  }
}
