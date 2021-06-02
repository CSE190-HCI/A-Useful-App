import React from "react";
import "../styles/SearchDisplayList.css";


class SearchDisplayList extends React.Component {
  render() {
    return (
      <div className="list-container"
           style={this.props.style}
           >
        { this.props.items }
      </div>
    )
  }
}

class SearchDisplayItem extends React.Component {

  handleSelect = () => {
    this.props.handleUpdate(this.props.songName, this.props.artist, this.props.id);
  };

  render() {
    return (
      <div
        className="item-container"
        onClick={this.handleSelect}
        onMouseEnter={this.props.handleMouseEnter}
        onMouseLeave={this.props.handleMouseLeave}
      >
        <label className="song-name"> { this.props.songName } </label>
        <label className="artist"> { this.props.artist } </label>
      </div>
    )
  }
}

// export default onClickOutside(SearchDisplayList)
export {SearchDisplayList, SearchDisplayItem};