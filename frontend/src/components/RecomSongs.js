import React from "react";
import "../styles/RecomSongs.css";
import { get } from "../utils/api";

class RecomSongs extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			recomSongIds: this.props.recomSongIds,
			recomSongs: []
		}	
	}

	componentDidMount(){
		var recomSongIds = this.state.recomSongIds;
		var songId;
		for (songId of recomSongIds){
			const searchUrl = `https://api.spotify.com/v1/albums/${songId}`;
			get(searchUrl)
			.then((res) => {
				this.setState({
					recomSongs: this.state.recomSongs.concat({
						image: res.images[0].url,
						name: res.name,
						url: res.href})
				});
			})		
		};
	}

    render() {
        return (
				<div className="song-container">
				 	{this.state.recomSongs.map((item,i) => 
				 		<div className="cell" key={i}>
				 			<img src={item.image} alt={item.name} />
							<div className="name">{item.name}</div>
						</div> ) }
				</div>
        )
    }
}

export default RecomSongs;
