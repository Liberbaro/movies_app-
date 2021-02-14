/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import Footer from '../footer/footer';
import './app.css';
// eslint-disable-next-line no-unused-vars
import Search from '../search/search';
import FilmList from '../film-list/film-lists';
import Serv from '../../serv/serv';
// import Serv from '../../serv/serv';

export default class App extends Component {
    serv = new Serv();

   state = {
     testFilmList: [],
     currentPage: 1,
   }

   constructor() {
     super();
     this.updateMovies();
   }

   updateMovies = () => {
     this.serv.test().then((res) => res.map((el) => {
       const newEl = {
         overview: el.overview,
         releaseDate: el.release_date,
         raiting: el.vote_average,
         title: el.title,
         poster: el.poster_path,
         genre: el.genre_ids,
       };
       return newEl;
     }))
       .then((res) => {
         this.setState({ testFilmList: res });
       });
   }

   render() {
     const { currentPage, testFilmList } = this.state;
     return (
       <section className="moviesapp">
         {/* <Search/> */}
         <FilmList movieList={testFilmList}/>
         <Footer currentPage={currentPage}/>
       </section>
     );
   }
}
