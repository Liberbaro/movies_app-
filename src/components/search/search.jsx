import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './search.scss';

export default class Search extends Component {
    static propTypes = { onChangeSearch: PropTypes.func.isRequired }

    state = { value: '' }

    onChangeInputHandler = (evt) => {
      const { value } = evt.target,
            { onChangeSearch } = this.props;
      this.setState({ value });
      onChangeSearch(value);
    }

    render() {
      const { value } = this.state;
      return (
        <input
          type="text"
          placeholder="Type to search..."
          className="movies-app__search search"
          maxLength="100"
          defaultValue={value}
          onChange={this.onChangeInputHandler}
        />
      );
    }
}
