import React from "react";
import "../styles/FeatureCard.css";
import axios from "axios";
import { SearchDisplayList, SearchDisplayItem } from "../components/SearchDisplayList";
import { get } from '../utils/api';
class FeatureCard extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isCheck : false,
            query: '',
            results: {},
            loading: false,
            message: '',
            // TODO: can delete this once we properly get results
            searchAppear: false,
            // just for where to put the search results
            searchStyle: {
                top: 0,
                left: 0,
                width: 0
            }
        };

        // TODO: delete this later; hardcoded data
        this.testItems = [
            <SearchDisplayItem songName="Perfect" artist="Ed Sheeran" key='1'/>,
            <SearchDisplayItem songName="Love Confession" artist="Jay Chou" key='2'/>,
            <SearchDisplayItem songName="lo-fi hip hop" artist="tysu" key='3'/>,
        ]

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

    handleChange = (e) => {
        this.setState({ ...this.state, isCheck: e.target.checked });
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
			console.log(this.state);
	};

	renderSearchResults = () => {
		const {results} = this.state;
		if (Object.keys(results).length && results.length) {
			return (
				<div className="results-container">
					Search Result
					<SearchDisplayList items={ <SearchDisplayItem songName="lo-fi hip hop" artist="tysu" key='3'/> }/>
				</div>
			);
		}
	};

    render(){

        return(
					<div className="container">
							
							{/* Feature header */}
							<label htmlFor={this.props.feature + "Card"} className="header">
									<input
											type="checkbox"
											id={this.props.feature + "Card"}
											checked={this.state.isCheck}
											onChange={e => this.handleChange(e)}												
									/>
									{this.props.feature}
							</label>

							{/* Song text label */}
							<div className="song">
									<p>Song: </p>
							</div>

							{/* Input text field */}
							<input
									type="text"
									placeholder="Search for a song..."
									className="text-field"
									onChange={this.handleOnInputChange}
									onFocus={e => this.handleFocus(e)}
									onBlur={e => this.handleBlur(e)}
							/>

							{/* TODO: delete this once results properly come thru */}
							{ this.state.searchAppear ? 
								<SearchDisplayList 
									items={this.testItems}
									style={this.state.searchStyle}
								/> :
								<></>
							}

							{/* Search Result field */}
							{ this.renderSearchResults() }
					</div>
        );
    }
}

export default FeatureCard;