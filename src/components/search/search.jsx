import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import './search.css';

export default class Search extends Component {
    state = { value: '' }

    onChangeInputHandler = (evt) => {
      const value = evt.target;
      this.setState({ value });
      if (evt.keyCode === 13) console.log(value);
    }

    render() {
      const { value } = this.state;
      return (
        <input
          type="text"
          placeholder="Type to search..."
          className="search"
          maxLength="100"
          defaultValue={value}
          onChange={this.onChangeInputHandler}
        />
      );
    }
}
