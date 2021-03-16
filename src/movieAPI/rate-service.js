import movieServiceApi from './movie-service-api';

export default class RateService extends movieServiceApi {
  async postRateFilm(moveId, guestId, rating = 0) {
    return this.postRequest(
      `${this.url}/movie/${moveId}/rating?${this.apiKey}&guest_session_id=${guestId}`,
      rating,
    );
  }
}
