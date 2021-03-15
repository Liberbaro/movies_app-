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

export default class App extends Component {
   moviesApi = new MovieApi();

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
     hasFilms: false,
     hasRated: false,
     hasError: false,
     ratedTab: false,
   }

   componentDidMount() {
     this.moviesApi.getGuestSessionID()
       .then(({ guest_session_id: guestSessionID }) => this.setState({ guestSessionID }));
     this.moviesApi
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
      hasFilms: false,
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
        hasFilms: !!newFilmsList.length,
      });
    }

    setNewGuestFilmsList = ({ guestFilmsList, ratedTotalPages }) => {
      const { ratedFilms } = this.state,
            newRatedFilmsList = this.compareRatings(guestFilmsList, ratedFilms);
      this.setState({
        guestFilmsList: newRatedFilmsList,
        ratedTotalPages,
        hasRated: !!newRatedFilmsList.length,
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
      this.moviesApi.getGuestFilmsList(guestSessionID, page)
        .then(this.setNewGuestFilmsList)
        .catch(this.onError);
    }

    onError = () => {
      this.setState({
        hasError: true,
        isLoaded: true,
        hasFilms: false,
        ratedTab: false,
      });
    }

    saveRatedFilm = (film, rating) => {
      const { ratedFilms } = this.state,
            newRatedFilms = { ...ratedFilms };
      if (newRatedFilms[film.key]) newRatedFilms[film.key].rating = rating;
      else newRatedFilms[film.key] = { rating, ...film };
      if (rating === 1) delete newRatedFilms[film.key];
      this.setState({ ratedFilms: newRatedFilms });
    }

    rateFilm = (film, rating) => {
      const { guestSessionID } = this.state,
            { key } = film;
      this.moviesApi.postRateFilm(key, guestSessionID, rating)
        .then(() => this.saveRatedFilm(film, rating)).catch(this.onError);
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
        hasFilms: false,
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
              hasFilms,
              hasRated,
              totalPages,
              genreList,
              ratedTab,
            } = this.state,
            { TabPane } = Tabs,
            isNotFound = !hasFilms && isLoaded && query !== '' && !hasError,
            isListFull = hasFilms && isLoaded && !hasError,
            errorMessage = hasError && <Alert message="Error"
              description="Sorry, we can't find the movie data. Try a different query."
              type="error" showIcon closable />,
            spinner = isLoaded || <div className="info-container span"><Spin size="large" tip="Please wait..."/></div>,
            filmNotFound = isNotFound && <p className="info-container not-found">Sorry. We can`t find this film</p>,
            ratedListEmpty = !hasRated && <p className="info-container empty-list">You gave a rating to  no one film</p>,
            isFilms = isListFull && <FilmsList
              films={ratedTab ? guestFilmsList : filmsList}
              rateFilm={this.rateFilm}/>,
            pagination = <Pagination
              size="small"
              pageSize={20}
              showSizeChanger={false}
              current={ratedTab ? currentRatedPage : currentPage}
              total={ratedTab ? ratedTotalPages : totalPages}
              onChange={this.onChangePage}
            />,
            isPagination = ratedTab ? hasRated && pagination : isFilms && pagination;

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
            {isFilms}
          </SwapiProviderGenres>
          {isPagination}
        </section>
      );
    }
}
