import React from "react";
import "../styles/SearchDisplayList.css";
import Dropzone from "./Dropzone";

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
  // state = {
  //   selectedSong : "",
  //   selectedArtist : "",
  //   songID : "",
  // }

  handleUpdate = () => {
    this.props.handleUpdate()
  };



  render() {
    return (
      <div className="item-container" onClick = {this.handleUpdate}>
        <label className="song-name"> { this.props.songName } </label>
        <label className="artist"> { this.props.artist } </label>
      </div>
    )
  }
}

export { SearchDisplayList, SearchDisplayItem };