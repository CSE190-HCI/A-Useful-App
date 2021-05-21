import React from "react";
import "../styles/SearchDisplayList.css";

class SearchDisplayList extends React.Component {
  render() {
    return (
      <div className="list-container"
           style={this.props.style}>
        { this.props.items }
      </div>
    )
  }
}

class SearchDisplayItem extends React.Component {
  render() {
    return (
      <div className="item-container">
        <label className="song-name"> { this.props.songName } </label>
        <label className="artist"> { this.props.artist } </label>
      </div>
    )
  }
}

export { SearchDisplayList, SearchDisplayItem };git 