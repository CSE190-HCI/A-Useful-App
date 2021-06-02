import React from "react";
import { ResultsItem } from "./ResultsList";
import TestRecSongItem from "./TestRecSongItem";

class RecomSongs extends React.Component {	
    handleMouseEnter = (features) => {
        this.props.handleMouseEnter(features);
    }

    // really just a wrapper function for consistency
    handleMouseLeave = () => {
        this.props.handleMouseLeave();
    }

    render() {
        // console.log(this.props.recomSongs);
        return (
				<div className="song-container">
				 	{this.props.recomSongs.map((item,i) => 
                        <TestRecSongItem
                            songName={item.name}
                            artist={item.artist}
                            energy={item.energy}
                            instrumentalness={item.instrumentalness}
                            positivity={item.positivity}
                            image={item.image}
                            url={item.spotify_url}
                            handleMouseEnter={(features) => this.handleMouseEnter(features)}
                            handleMouseLeave={this.handleMouseLeave}
                        />
                )   }
				</div>
        )
    }
}

export default RecomSongs;
