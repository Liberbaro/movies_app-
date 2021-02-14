/* eslint-disable quotes */
export default class Serv {
  constructor() {
    this.Url = `https://api.themoviedb.org/3/`;
    this.Key = `api_key=5908be7961cd99390b32d8964c4435e7`;
  }

  async getResp(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Can't ${url} because ${res.status}`);
    }
    // eslint-disable-next-line one-var
    const result = await res.json();
    return result;
  }

  async postResp(url, rating) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ value: rating }),
    });
          // result = await res.json();
    if (!res.ok) {
      throw new Error('Can\'t find movie');
    }
    // eslint-disable-next-line one-var
    const result = await res.json();
    return result;
  }

  async test() {
    const movies = await this.getResp(
      `${this.Url}search/movie?${this.Key}&language=en-US&query="return"&page=${1}&include_adult=false`,
    );
    return movies.results;
  }

  async testBody() {
    const res = await this.test().then((wow) => console.log(wow.results));
    return res;
  }
}

// eslint-disable-next-line no-unused-vars
