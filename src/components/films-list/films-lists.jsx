import React from 'react';
import PropTypes from 'prop-types';
import './film-lists.scss';
import FilmInfo from '../film-info/film-info';

const FilmsList = ({ films, rateFilm }) => {
  const movie = films.map((film) => {
    return (
      <li key={film.key} className="film-list__item">
        <FilmInfo film={film} rateFilm={rateFilm}/>
      </li>
    );
  });

  return (
    <ul className="movie-list">
      {movie}
    </ul>
  );
};

FilmsList.propTypes = {
  films: PropTypes.arrayOf(PropTypes.object).isRequired,
  rateFilm: PropTypes.func.isRequired,
};

export default FilmsList;
