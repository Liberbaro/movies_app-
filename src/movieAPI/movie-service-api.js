export default class movieServiceApi {
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
}
