/* eslint-disable */
import React, { Component } from 'react';
import { Spin, Alert, Pagination, Tabs } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { debounce } from 'lodash';
import { SwapiProviderGenres } from '../swapi-service-genre/swapi-service-genres';
import Search from '../search/search';
import FilmsList from '../films-list/films-lists';
import MovieApi from '../../movieAPI/movie-api';
import './app.scss';
import 'antd/es/spin/style/css';
import GuestSessionService from '../../movieAPI/guest-session-service';
import RateService from '../../movieAPI/rate-service';
import GenreService from '../../movieAPI/genre-service';

export default class App extends Component {
  moviesApi = new MovieApi();

  guestSessionService = new GuestSessionService();

  rateService = new RateService();

  genreService = new GenreService();

  state = {
    genreList: [],
    filmsList: [],
    guestFilmsList: [],
    ratedFilms: {},
    query: '',
    currentPage: 1,
    currentRatedPage: 1,
    totalPages: null,
    ratedTotalPages: null,
    guestSessionID: null,
    isLoaded: true,
    hasError: false,
    ratedTab: false,
  }

  componentDidMount() {
    this.guestSessionService.getGuestSessionID()
      .then(({ guest_session_id: guestSessionID }) => this.setState({ guestSessionID }));
    this.genreService
      .getGenreList()
      .then((genreList) => this.setState({ genreList }))
      .catch(this.onError);
  }

  onChangeSearch = debounce((query) => {
    const { currentPage } = this.state;
    if (query === '') {
      this.clearFilmsList();
      return;
    }
    this.setState({
      isLoaded: false,
      hasError: false,
      query,
    });
    this.updateFilmsList(query, currentPage);
  }, 800)

  compareRatings = (filmList, ratedFilms) => filmList.map((el) => ratedFilms[el.key] || el);

  setNewFilmsList = ({ filmsList, totalPages }) => {
    const { ratedFilms } = this.state,
          newFilmsList = this.compareRatings(filmsList, ratedFilms);
    this.setState({
      filmsList: newFilmsList,
      totalPages,
      isLoaded: true,
    });
  }

  setNewGuestFilmsList = ({ guestFilmsList, ratedTotalPages }) => {
    const { ratedFilms } = this.state,
          newRatedFilmsList = this.compareRatings(guestFilmsList, ratedFilms);
    this.setState({
      guestFilmsList: newRatedFilmsList,
      ratedTotalPages,
      ratedTab: true,
    });
  }

  updateFilmsList = (filmName, page = 1) => {
    this.moviesApi.getMoviesLIst(filmName, page)
      .then(this.setNewFilmsList)
      .catch(this.onError);
  }

  updateGuestFilmsList = (page = 1) => {
    const { guestSessionID } = this.state;
    this.guestSessionService.getGuestFilmsList(guestSessionID, page)
      .then(this.setNewGuestFilmsList)
      .catch(this.onError);
  }

  onError = () => {
    this.setState({
      hasError: true,
      isLoaded: true,
      ratedTab: false,
    });
  }

  saveRatedFilm = (film, rating) => {
    const { ratedFilms } = this.state,
          newRatedFilms = { ...ratedFilms };
    if (newRatedFilms[film.key]) newRatedFilms[film.key].rating = rating;
    else newRatedFilms[film.key] = { rating, ...film };
    this.setState({ ratedFilms: newRatedFilms });
  }

  rateFilm = (film, rating) => {
    if (rating === 0) return;
    const { guestSessionID } = this.state,
          { key } = film;
    this.rateService.postRateFilm(key, guestSessionID, rating)
      .then(() => this.saveRatedFilm(film, rating));
  }

  onChangePage = (page) => {
    const { query, ratedTab } = this.state;
    if (ratedTab) {
      this.setState({ currentRatedPage: page });
      this.updateGuestFilmsList(page);
    } else {
      this.setState({ currentPage: page });
      this.updateFilmsList(query, page);
    }
  };

  clearFilmsList = () => {
    this.setState({
      filmsList: [],
      isLoaded: true,
      hasError: false,
      totalPages: null,
      query: '',
    });
    return null;
  }

  onChangeTabs = (activeKey) => {
    const { query, currentPage, currentRatedPage } = this.state;
    if (activeKey === 'Rated') this.updateGuestFilmsList(currentRatedPage);
    else {
      this.setState({ ratedTab: false });
      if (query !== '') this.updateFilmsList(query, currentPage);
    }
  }

  render() {
    const {
            query,
            guestFilmsList,
            ratedTotalPages,
            currentPage,
            currentRatedPage,
            filmsList,
            isLoaded,
            hasError,
            totalPages,
            genreList,
            ratedTab,
          } = this.state;
    const { TabPane } = Tabs;
    const hasRated = !!guestFilmsList.length;
    const hasFilms = !!filmsList.length;
    const isNotFound = !hasFilms && isLoaded && query !== '' && !hasError;
    const isListFull = hasFilms && isLoaded && !hasError;
    const errorMessage = hasError && <Alert message="Error"
            description="Sorry, we can't find the movie data. Try a different query."
            type="error" showIcon closable />;
    const spinner = isLoaded || <div className="info-container span"><Spin size="large" tip="Please wait..."/></div>;
    const filmNotFound = isNotFound && <p className="info-container not-found">Sorry. We can`t find this film</p>;
    const ratedListEmpty = !hasRated && <p className="info-container empty-list">You gave a rating to  no one film</p>;
    const allFilmsList = isListFull && <FilmsList
            films={ratedTab ? guestFilmsList : filmsList}
            rateFilm={this.rateFilm}/>;
    const pagination = <Pagination
            size="small"
            pageSize={20}
            showSizeChanger={false}
            current={ratedTab ? currentRatedPage : currentPage}
            total={ratedTab ? ratedTotalPages : totalPages}
            onChange={this.onChangePage}
          />;
    const isPagination = ratedTab ? hasRated && pagination : allFilmsList && pagination;

    return (
      <section className="movies-app">
        <Tabs activeKey={ratedTab ? 'Rated' : 'Search'}
          onChange={this.onChangeTabs}
          centered>
          <TabPane tab="Search" key="Search">
            <Search onChangeSearch={this.onChangeSearch}/>
            {spinner}
            {errorMessage}
            {filmNotFound}
          </TabPane>
          <TabPane tab="Rated" key="Rated">
            {ratedListEmpty}
          </TabPane>
        </Tabs>
        <SwapiProviderGenres value={genreList}>
          {allFilmsList}
        </SwapiProviderGenres>
        {isPagination}
      </section>
    );
  }
}
