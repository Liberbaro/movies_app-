/* eslint-disable no-shadow,react/prop-types,no-undef,no-unused-vars */
import React from 'react';
// import PropTypes from 'prop-types';
import './film-lists.css';
import FilmInfo from '../film-info/film-info';

const FilmList = ({ filmsList }) => {
  let key = 1;
  const movie = filmsList.map((film) => {
    return (
      <li key={key++} className="film-list__item">
        <FilmInfo film={film} />
      </li>
    );
  });
  return (
    <ul className="movie-list">
      {movie}
    </ul>
  );
};

export default FilmList;
