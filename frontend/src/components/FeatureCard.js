import React from "react";
import "../styles/FeatureCard.css";
import axios from "axios";

class FeatureCard extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isCheck : false,
            query: '',
            results: {},
            loading: false,
            message: ''
        };
		this.cancel = '';
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
		const searchUrl = `https://api.spotify.com/v1/search?q=${query}`;
		if (this.cancel) {
			// Cancel the previous request before making a new request
			this.cancel.cancel();
		}
		// Create a new CancelToken
		this.cancel = axios.CancelToken.source();
		axios
			.get(searchUrl, {
				cancelToken: this.cancel.token,
			})
			.then((res) => {
				const resultNotFoundMsg = !res.data.hits.length
					? 'There are no more search results. Please try a new search.'
					: '';
				this.setState({
					results: res.data.hits,
					message: resultNotFoundMsg,
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
		const {results} = this.state;
		if (Object.keys(results).length && results.length) {
			return (
				<div className="results-container">
					Search Result
					{/* TODO */}
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
                />
                {/* Search Result field */}
                { this.renderSearchResults() }
            </div>
        );
    }
}

export default FeatureCard;
