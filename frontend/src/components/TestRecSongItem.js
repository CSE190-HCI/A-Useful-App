import React from 'react';
import "../styles/TestRecSongItem.css";

class TestRecSongItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            artist: this.props.artist,
            songName: this.props.songName,
            image: this.props.image,
            energy: this.props.energy,
            instrumentalness: this.props.instrumentalness,
            positivity: this.props.positivity,
        };
    }

    getFeaturesObject = () => {
        return {
            energy: this.state.energy,
            instrumentalness: this.state.instrumentalness,
            positivity: this.state.positivity,
        }
    }

    handleMouseEnter = () => {
        this.props.handleMouseEnter(this.getFeaturesObject());
    }

    // really just a wrapper function for consistency
    handleMouseLeave = () => {
        this.props.handleMouseLeave();
    }

    render() {
        return (
            <div className="test-rec-song-container"
                onClick={this.handleSelect}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <img src={this.state.image} alt="album cover"/>
                <div className="labels">
                    <label className="song-name"> { this.props.songName } </label>
                    <label className="artist"> { this.props.artist } </label>
                </div>
            </div>
        );
    }
}

export default TestRecSongItem;