import React from 'react';
import FeatureCard from "./FeatureCard";
import { SearchDisplayList, SearchDisplayItem } from "../components/SearchDisplayList";
import { get } from '../utils/api';
import axios from "axios";
import "../styles/Dashboard.css";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            query: '',
            results: {},
            loading: false,
            message: '',
            // just for where to put the search results
            searchStyle: {
                top: 0,
                left: 0,
                width: 0
            }
        };

		this.cancel = '';
    }

    // TODO: maybe delete this if don't need it
    handleFocus = (e) => {
        let rect = e.target.getBoundingClientRect();
        this.setState({ searchStyle: { top: rect.bottom, left: rect.left, width: rect.width } });
        this.setState({ searchAppear: true });
    }
    
    // TODO: maybe delete this if don't need it
    handleBlur = (e) => {
        this.setState({ searchAppear: false });
    }

    handleOnInputChange = (e) => {
        const query = e.target.value;
        if ( ! query ) {
            this.setState({ query, results: {}, message: '' } );
        } else {
            this.setState({ query, loading: true, message: '' }, () => {
                this.fetchSearchResults(query);
            });
        }
    };

    fetchSearchResults = (query) => {
        const searchUrl = `https://api.spotify.com/v1/search?query=${encodeURIComponent(query)}&type=album,playlist,artist`;
        if (this.cancel) {
            // Cancel the previous request before making a new request
            this.cancel.cancel();
        }
        // Create a new CancelToken
        this.cancel = axios.CancelToken.source();

        get(searchUrl, {
            cancelToken: this.cancel.token,
        })
        .then((res) => {
            console.log(res);
            this.setState({
                results: res,
                loading: false,
            });
        })
        .catch((error) => {
            if (axios.isCancel(error) || error) {
                this.setState({
                    loading: false,
                    message: 'Failed to fetch results.Please check network',
                });
            }
        });
    };

    renderSearchResults = () => {
		if (Object.keys(this.state.results).length && 
				this.state.results.albums.items.length) {
			
			// get the first three songs
            const songs = this.state.results.albums.items;

			// create the search display items from each song
			const items = songs.map(song => {
				return <SearchDisplayItem 
					songName={song.name}
					artist={song.artists[0].name}
					key={song.id}
				/>
			})

			return (
				<div className="results-container">
					<SearchDisplayList 
						items={ items } 
						style={ this.state.searchStyle }
					/>
				</div>
			);
		}
	};

    render() {
        return(
            <div>
                <header className="App-header">
                    <div className="search-songs">
                        <p>Search Songs</p>
                        {/* Input text field */}
                        <input
                                type="text"
                                placeholder="Search for a song..."
                                className="text-field"
                                onChange={this.handleOnInputChange}
                                onFocus={e => this.handleFocus(e)}
                                onBlur={e => this.handleBlur(e)}
                        />

                        {/* Search Result field */}
                        { this.renderSearchResults() }
                    </div>
                    <div className="feature-buckets">           
                        <FeatureCard feature="Energy"/>
                        <FeatureCard feature="Instrumentalness"/>
                        <FeatureCard feature="Mood"/>
                    </div>
                    <div className="results">
                        <p>Results</p>
                    </div>
                </header>
            </div>
        );
    }
};
export default Dashboard;