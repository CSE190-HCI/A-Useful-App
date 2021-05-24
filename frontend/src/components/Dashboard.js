import React from "react";

import FeatureCard from "./FeatureCard";
import { SearchDisplayList, SearchDisplayItem } from "./SearchDisplayList";
import { ResultsList, ResultsItem, TotalBar } from "./ResultsList";

import "../styles/Dashboard.css";
import Dropzone from "./Dropzone";
import {
    computeWidthsForFeatures,
    createSongFeaturesObject,
} from "../utils/functions.js";

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
            isUpdate: false,
            preventSearchDisappear: false,
            searchAppear: false,
            selectedSong: "song",
            selectedArtist: "artist",
            songID: "id",
        };

        this.cancel = "";
    }

    buckets = [
        {
            energy: [
                { energy: 0.85, instrumentalness: 0.45, positivity: 0.75 },
            ],
            instrumentalness: [],
            positivity: [
                { energy: 0.64, instrumentalness: 0.79, positivity: 0.15 },
                { energy: 0.85, instrumentalness: 0.45, positivity: 0.36 },
            ],
        },
    ];

    // { energy: 0.85, instrumentalness: 0.45, positivity: 0.36 } = songFeaturesObject

    // function(buckets) -> targetAcc

    printRes = (res) => {
        console.log(`res is ${res}`);
    };

    componentDidMount() {
        const songFeatureObj = createSongFeaturesObject(
            "53nhbx7yp4TJEpmMBCLWPQ",
            this.state.cancel
        );
        this.setState({ loading: false });
        console.log(`createSongFeaturesObject returns ${songFeatureObj}`);
        songFeatureObj.then((res, err) => {
            this.printRes(res);
        });
    }

    /* When a song gets dragged into a bucket, add songFeaturesObject to the right bucket
       in buckets[], then call computeWidthsForFeatures
     */
    targetAcc = { energy: 0.85, instrumentalness: 0.45, positivity: 0.75 };
    songSuggestion = {};

    featureRatios = computeWidthsForFeatures(
        this.targetAcc,
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
            feature="Positivity"
            bar={<TotalBar widths={this.featureRatios.positivity} />}
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

    checkSearch = () => {
        console.log(
            `PreventSearchDisappear is now ${this.state.preventSearchDisappear}`
        );
    };

    // TODO: maybe delete this if don't need it
    handleBlur = (e) => {
        this.checkSearch();
        if (!this.state.preventSearchDisappear)
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

    printSongArtistID = () => {
        console.log(
            `this.state is now ${this.state.selectedSong}, ${this.state.selectedArtist}, ${this.state.songID}`
        );
    };

    handleSelect = (name, artist, ID) => {
        this.setState(
            {
                preventSearchDisappear: false,
                selectedSong: name,
                selectedArtist: artist,
                songID: ID,
                isUpdate: true,
            },
            this.printSongArtistID
        );
    };

    handleMouseEnter = () => {
        console.log("handleMouseEnter is called");
        this.setState({
            preventSearchDisappear: true,
        });
    };

    handleMouseLeave = () => {
        console.log("handleMouseLeave is called");
        this.setState(
            {
                preventSearchDisappear: false,
            },
            this.checkSearch()
        );
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
                        id={song.id}
                        handleUpdate={this.handleSelect}
                        handleMouseEnter={this.handleMouseEnter}
                        handleMouseLeave={this.handleMouseLeave}
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
                        {this.state.searchAppear ? (
                            this.renderSearchResults()
                        ) : (
                            <></>
                        )}
                    </div>

                    <div>
                        <Dropzone
                            selectedSong={this.state.selectedSong}
                            selectedArtist={this.state.selectedArtist}
                            songID={this.state.songID}
                        />
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
