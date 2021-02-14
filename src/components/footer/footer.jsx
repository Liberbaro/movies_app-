import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './footer.css';

export default class Footer extends Component {
    static defaultProps = { currentPage: 1 }

    static propTypes = { currentPage: PropTypes.number }

    state = {
      buttonsList: [
        { num: 1 },
        { num: 2 },
        { num: 3 },
        { num: 4 },
        { num: 5 },
      ],
    }

    render() {
      const { buttonsList } = this.state,
            { currentPage } = this.props,
            buttons = buttonsList.map((el) => {
              const selected = currentPage === el.num ? 'selected' : '';
              return <button key={el.num} type="button" className={`pages ${selected}`}>{el.num}</button>;
            });
      return (
        <div>
          <button type="button" className="arrow prev"/>
          {buttons}
          <button type="button" className="arrow next"/>
        </div>
      );
    }
}
