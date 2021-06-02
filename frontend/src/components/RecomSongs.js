import React from "react";
import "../styles/RecomSongs.css";
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
        return (
				<div className="song-container">
				 	{this.props.recomSongs.map((item,i) => 
                        <TestRecSongItem
                            songName={item.name}
                            artist="artist"
                            energy={item.energy}
                            instrumentalness={item.instrumentalness}
                            positivity={item.positivity}
                            image={item.image}
                            url={item.spotify_url}
                            handleMouseEnter={(features) => this.handleMouseEnter(features)}
                            handleMouseLeave={this.handleMouseLeave}
                        />
                    /* Old implementation, can borrow some stuff */

				 		// <div
                        //     className="cell" key={i}
                        //     onMouseEnter={this.handleMouseEnter}
                	    //     onMouseLeave={this.handleMouseLeave}
                        // >
				 			// <img src={item.image} alt={item.name} />
							// <div className="name">{item.name}</div>
						// </div>
                ) }
				</div>
        )
    }
}

export default RecomSongs;
