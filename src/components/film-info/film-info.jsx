import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';
import './film-info.scss';
import { SwapiConsumerGenres } from '../swapi-service-genre/swapi-service-genres';

export default class FilmInfo extends Component {
  static propTypes = {
    film: PropTypes.shape({
      synopsis: PropTypes.func.isRequired,
      release: PropTypes.string.isRequired,
      poster: PropTypes.string.isRequired,
      voteAverage: PropTypes.number.isRequired,
      title: PropTypes.func.isRequired,
      genre: PropTypes.arrayOf(PropTypes.number),
      key: PropTypes.number.isRequired,
      rating: PropTypes.number,
    }).isRequired,
    rateFilm: PropTypes.func.isRequired,
  }

  state = { synopsis: null }

  componentDidMount() {
    this.synopsis();
    window.addEventListener('resize', this.synopsis);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.synopsis);
  }

  genreTransform = (genresList, num = 0) => {
    const { film } = this.props;
    if (num === 0) return film.genre.map((el) => genresList[el]);
    return film.genre.slice(0, num).map((el) => {
      return <li key={el + film.key} className="genres__item">{genresList[el]}</li>;
    });
  }

  voteColor= (vote) => {
    const basicClass = (mark) => `film-info__vote-average vote-average vote-average--${mark}`;
    if (vote < 3) return basicClass('low');
    if (vote >= 3 && vote < 5) return basicClass('medium');
    if (vote >= 5 && vote < 7) return basicClass('high');
    return basicClass('highest');
  }

  synopsis = (arg) => {
    const { film } = this.props,
          { synopsis } = film;
    if (arg === 0) return synopsis();
    this.setState(() => {
      if (document.documentElement.clientWidth > 520) return { synopsis: synopsis(210) };
      return { synopsis: synopsis(248) };
    });
    return null;
  }

  title = (num) => {
    const { film } = this.props,
          { title } = film;
    return (Array.isArray(title)) ? title[num] : title;
  }

  render() {
    const { film, rateFilm } = this.props,
          { synopsis } = this.state,
          { poster, title, voteAverage, release, rating } = film;
    return (
      <SwapiConsumerGenres>
        {(genreList) => {
          return (
            <article className="film-info">
              <div className="film-info__poster--swapper">
                <img className="film-info__poster" src={poster}
                  alt={`Poster for the film ${title}`}/>
              </div>
              <div className="film-info__description">
                <div className="film-info__main">
                  <h2 className="film-info__title" title={title(20, 1)}>{title(20)}</h2>
                  <span className={this.voteColor(voteAverage)}>{voteAverage}</span>
                </div>
              </div>
              <span className="film-info__date">{release}</span>
              <ul className="film-info__genres genres" title={this.genreTransform(genreList)}>
                {this.genreTransform(genreList, 3)}</ul>
              <p className="film-info__synopsis" title={this.synopsis(0)}>{synopsis}</p>
              <Rate allowHalf
                className="film-info__star"
                count={10}
                defaultValue={rating}
                onChange={(value) => rateFilm(film, value)}/>
            </article>
          );
        }}
      </SwapiConsumerGenres>);
  }
}
