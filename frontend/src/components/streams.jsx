import React, { Component } from 'react';
import { playRadio } from '../services/playerService';
import { getStreams } from '../services/streamsService';
import { withTranslation } from 'react-i18next';
import './streams.scss';
import SearchBox from './common/searchBox';

class Streams extends Component {
  state = { streams: {}, query: '' };

  async componentDidMount() {
    const { data: streams } = await getStreams();
    this.setState({ streams });
  }

  isPlaying = name => {
    return (
      name === this.props.playerStatus.title && this.props.playerStatus.playing
    );
  };

  handleItemClick = name => {
    if (this.isPlaying(name)) return;
    this.props.onAlert(this.props.t('tunning'), name);
    playRadio(name);
  };

  getItemClasses = name => {
    const classes = 'streams__item ellipsis list-group-item';
    return this.isPlaying(name) ? classes + ' active' : classes;
  };

  handleSearch = query => {
    this.setState({ query });
  };

  filteredStreams() {
    const { streams, query } = this.state;

    if (query === '') return streams;

    let filtered = {};
    for (let k in streams) {
      if (k.toLowerCase().includes(query.toLowerCase()) && streams[k] !== '') {
        filtered[k] = streams[k];
      }
    }
    return filtered;
  }

  renderList() {
    const streams = this.filteredStreams();

    if (Object.keys(streams).length === 0)
      return <h4 className="p-4">{this.props.t('noStreams')}</h4>;

    return (
      <ul className="list-group list-group-flush list-group-striped">
        {Object.keys(streams).map(name =>
          streams[name] === '' ? (
            <li className="streams__header ellipsis" key={name}>
              {name}
            </li>
          ) : (
            <li
              className={this.getItemClasses(name)}
              key={name}
              onClick={() => this.handleItemClick(name)}
            >
              {name}
            </li>
          )
        )}
      </ul>
    );
  }

  render() {
    return (
      <div className="streams p-4">
        <SearchBox value={this.state.query} onChange={this.handleSearch} />
        {this.renderList()}
      </div>
    );
  }
}

export default withTranslation()(Streams);