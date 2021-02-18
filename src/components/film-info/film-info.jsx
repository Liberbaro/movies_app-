/* eslint-disable no-undef,react/prop-types,max-len,eol-last */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies,no-unused-vars
import { format, formatDistanceToNow } from 'date-fns';
// import PropTypes from 'prop-types';
import './film-info.css';

const FilmInfo = ({ film }) => {
  const genre = film.genre.map((el) => {
          return <li key={el} className="film-info__item">{el}</li>;
        }),
        releaseDate = format(new Date(film.releaseDate), 'MMMM d, yyyy'),
        posterUrl = `https://image.tmdb.org/t/p/original/${film.poster}`;

  function onCut(text) {
    let newText = text.slice(0, 200);
    const lastSpace = newText.lastIndexOf(' ');
    if (lastSpace !== newText.length) newText = newText.slice(0, lastSpace);
    return `${newText}...`;
  }

  return (
    <article className="film-info">
      <div className="film-info__poster--swapper">
        <img className="film-info__poster" src={posterUrl} alt={`постер к фильму ${film.title}`}/>
      </div>
      <div className="film-info__description">
        <div className="film-info__main">
          <h2 className="film-info__title">{film.title}</h2>
          <span className="film-info__raiting">{film.raiting}</span>
        </div>
        <span className="film-info__date">{releaseDate}</span>
        <ul className="film-info__types">{film.genre ? genre : null}</ul>
        <p className="film-info__synopsis">{onCut(film.overview)}</p>
        <div className="film-info__start"/>
      </div>
    </article>
  );
};

export default FilmInfo;
