import React from "react";
import "../styles/RecomSongs.css";

class RecomSongs extends React.Component {

    render() {
        return (
				<div className="song-container">
				 	{this.props.recomSongs.map((item,i) => 
				 		<div className="cell" key={i}>
				 			<img src={item.image} alt={item.name} />
							<div className="name">{item.name}</div>
						</div> ) }
				</div>
        )
    }
}

export default RecomSongs;
