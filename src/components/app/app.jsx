/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
// eslint-disable-next-line no-unused-vars
import Footer from '../footer/footer';
import './app.css';
// eslint-disable-next-line no-unused-vars
import Search from '../search/search';
import FilmList from '../film-list/film-lists';
import Serv from '../../serv/serv';

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
     this.serv.getDataFilm('return').then((res) => {
       this.setState({ testFilmList: res });
     });
   }

   render() {
     // eslint-disable-next-line no-unused-vars
     const { currentPage, testFilmList } = this.state;
     return (
       <section className="moviesapp">
         {/* <Search/> */}
         <FilmList filmsList={testFilmList}/>
         {/* <Footer currentPage={currentPage}/> */}
       </section>
     );
   }
}
