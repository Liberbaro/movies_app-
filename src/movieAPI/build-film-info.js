// eslint-disable-next-line import/no-extraneous-dependencies
import { format } from 'date-fns';
import defaultPoster from '../img/defaultPoster.png';

export default class BuildFilmInfo {
  build = (film) => {
    const { release_date: releaseDate, poster_path: posterUrl } = film,
          cutSynopsis = function () {
            const text = film.overview;
            return function (maxLenght) {
              if (!maxLenght) return text;
              if (!text) return 'Ooops. This movie doesn\'t seem to have a description. But you can search another!';
              if (text.length <= maxLenght) return text;
              let newText = text.slice(0, maxLenght);
              const lastSpace = newText.lastIndexOf(' ');
              if (lastSpace > 0) newText = newText.slice(0, lastSpace);
              return `${newText}...`;
            };
          },
          onCutTitle = function () {
            const text = film.title;
            return function (maxLenght, arg) {
              if (text.length <= maxLenght) return text;
              let newText = text.slice(0, maxLenght);
              const lastSpace = newText.lastIndexOf(' ');
              if (lastSpace > 0) newText = newText.slice(0, lastSpace);
              return arg ? text : `${newText}...`;
            };
          };

    return {
      synopsis: cutSynopsis(),
      release: releaseDate ? format(new Date(releaseDate), 'MMMM d, yyyy') : 'Release date unknown',
      poster: posterUrl ? `https://image.tmdb.org/t/p/original${posterUrl}` : defaultPoster,
      voteAverage: film.vote_average || 0,
      title: onCutTitle() || 'There\'s nothing here',
      genre: film.genre_ids,
      key: film.id,
    };
  }
}
