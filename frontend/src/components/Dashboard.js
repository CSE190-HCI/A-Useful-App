import React from "react";

import FeatureCard from "./FeatureCard";
import { SearchDisplayList, SearchDisplayItem } from "./SearchDisplayList";
import { ResultsList, ResultsItem, TotalBar } from "./ResultsList";

import "../styles/Dashboard.css";
import Dropzone from "./Dropzone";

import { get } from "../utils/api";
import axios from "axios";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: "",
            results: {},
            loading: false,
            message: "",
            // just for where to put the search results
            searchStyle: {
                top: 0,
                left: 0,
                width: 0,
            },

            selectedSong : "",
            selectedArtist : "",
            songID : "",
        };

        this.cancel = "";
    }

    target = { energy: 0.7, instrumentalness: 0.45, mood: 0.75 };
    songSuggestion = { energy: 0.8, instrumentalness: 0.5, mood: 0.65 };

    convertToPercentage = (value) => {
        return Math.round((value / 1) * 100) + "%";
    };

    computeWidths = (targetValue, suggestionValue) => {
        let greenWidth =
            suggestionValue >= targetValue
                ? this.convertToPercentage(suggestionValue)
                : this.convertToPercentage(0);
        let redWidth =
            suggestionValue < targetValue
                ? this.convertToPercentage(targetValue)
                : this.convertToPercentage(0);
        let baseWidth =
            suggestionValue < targetValue
                ? this.convertToPercentage(suggestionValue)
                : this.convertToPercentage(targetValue);
        return {
            baseWidth: baseWidth,
            redWidth: redWidth,
            greenWidth: greenWidth,
        };
    };

    computeWidthsForFeatures = (target, songSuggestion) => {
        let featureRatios = {};
        for (const feature of Object.keys(target)) {
            featureRatios[feature] = this.computeWidths(
                target[feature],
                songSuggestion[feature]
            );
        }
        return featureRatios;
    };

    featureRatios = this.computeWidthsForFeatures(
        this.target,
        this.songSuggestion
    );

    items = [
        <ResultsItem
            feature="Energy"
            bar={<TotalBar widths={this.featureRatios.energy} />}
        />,
        <ResultsItem
            feature="Instrumentalness"
            bar={<TotalBar widths={this.featureRatios.instrumentalness} />}
        />,
        <ResultsItem
            feature="Mood"
            bar={<TotalBar widths={this.featureRatios.mood} />}
        />,
    ];

    // TODO: maybe delete this if don't need it
    handleFocus = (e) => {
        let rect = e.target.getBoundingClientRect();
        this.setState({
            searchStyle: {
                top: rect.bottom,
                left: rect.left,
                width: rect.width,
            },
        });
        this.setState({ searchAppear: true });
    };

    // TODO: maybe delete this if don't need it
    handleBlur = (e) => {
        this.setState({ searchAppear: false });
    };

    handleOnInputChange = (e) => {
        const query = e.target.value;
        if (!query) {
            this.setState({ query, results: {}, message: "" });
        } else {
            this.setState({ query, loading: true, message: "" }, () => {
                this.fetchSearchResults(query);
            });
        }
    };

    fetchSearchResults = (query) => {
        const searchUrl = `https://api.spotify.com/v1/search?query=${encodeURIComponent(
            query
        )}&type=album,playlist,artist`;
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
                        message: "Failed to fetch results.Please check network",
                    });
                }
            });
    };

    renderSearchResults = () => {
        if (
            Object.keys(this.state.results).length &&
            this.state.results.albums.items.length
        ) {
            // get the first three songs
            const songs = this.state.results.albums.items;

            // create the search display items from each song
            const items = songs.map((song) => {
                return (
                    <SearchDisplayItem
                        songName={song.name}
                        artist={song.artists[0].name}
                        key={song.id}
                        handleUpdate = {this.handleSelect(song.name,song.artists[0].name,song.id)}
                    />
                );
            });

            return (
                <div className="results-container">
                    <SearchDisplayList
                        items={items}
                        style={this.state.searchStyle}
                    />
                </div>
            );
        }
    };

    render() {
        return (
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
                            onFocus={(e) => this.handleFocus(e)}
                            onBlur={(e) => this.handleBlur(e)}
                        />

                        {/* Search Result field */}
                        {this.renderSearchResults()}
                    </div>

                    <div>
                        <Dropzone/>
                    </div>
                    
                    <div className="results">
                        <p>Results</p>
                        <ResultsList items={this.items} />
                    </div>
                </header>
            </div>
        );
    }
}
export default Dashboard;
