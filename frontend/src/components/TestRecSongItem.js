import React from 'react';
import "../styles/TestRecSongItem.css";

class TestRecSongItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            artist: this.props.artists,
            songName: this.props.songName,
            image: this.props.image,
            energy: this.props.energy,
            instrumentalness: this.props.instrumentalness,
            positivity: this.props.positivity,
        };
    }

    getFeaturesObject = () => {
        return {
            energy: this.props.energy,
            instrumentalness: this.props.instrumentalness,
            positivity: this.props.positivity,
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
                <img src={this.props.image} alt="album cover"/>
                <div className="labels">
                    <label className="song-name"> { this.props.songName } </label>
                    <label className="artist"> { this.props.artist } </label>
                </div>
            </div>
        );
    }
}

export default TestRecSongItem;