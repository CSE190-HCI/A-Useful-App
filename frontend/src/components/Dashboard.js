import React from "react";

import TestRecSongItem from "./TestRecSongItem";
import { SearchDisplayList, SearchDisplayItem } from "./SearchDisplayList";
import { ResultsList, ResultsItem, TotalBar } from "./ResultsList";
import RecomSongs from "./RecomSongs";

import "../styles/Dashboard.css";
import Dropzone from "./Dropzone";
import {
    computeWidthsForFeatures,
    createSongFeaturesObject,
    returnResultsItems,
    calculateBaselines,
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
            selectedSong: "",
            selectedArtist: "",
            songID: "",

            resultsItems: [],
            targetAcc: {},

            // switch between FeatureCards and RecomSongs
            active: "CARDS",

            // update this from backend recommendations
            // TODO: content filled with sample data
            recomSongIds: [
                "52kvZcbEDm0v2kWZQXjuuA",
                "2V3H7K7plyYRjKzAoDK3SK",
                "52kvZcbEDm0v2kWZQXjuuA",
                "2V3H7K7plyYRjKzAoDK3SK",
                "52kvZcbEDm0v2kWZQXjuuA",
                "2V3H7K7plyYRjKzAoDK3SK",
                "52kvZcbEDm0v2kWZQXjuuA",
                "2V3H7K7plyYRjKzAoDK3SK"
                ]
        };

        this.cancel = "";
    }

    buckets = {
        energy: [
            // { energy: 0.85, instrumentalness: 0.45, positivity: 0.75 }
        ],
        instrumentalness: [],
        positivity: [
            // { energy: 0.64, instrumentalness: 0.79, positivity: 0.15 },
            // { energy: 0.26, instrumentalness: 0.45, positivity: 0.36 },
        ],
    };

    /* 
        A function to add a songFeaturesObject to the right bucket of the
        underlying buckets model.
     */
    addToBuckets = (songFeaturesObject, buckets, bucket) => {
        buckets[bucket].push(songFeaturesObject);
    };

    /* 
        A function to add a songFeaturesObject to the right bucket of the
        underlying buckets model.
     */
    removeFromBuckets = (songFeaturesObject, buckets, bucket) => {
        const index = buckets[bucket].indexOf(songFeaturesObject);
        buckets[bucket].splice(index, 1);
    };

    /* 
        A wrapper function just for setting the resultsItems state in order
        to update the results bar UI and render the bars correctly.
    */
    updateResultsItems = (featureRatios) => {
        this.setState({ resultsItems: returnResultsItems(featureRatios) });
    };

    /*
        Called when a song is added to a bucket. Given the newly added song
        id and the name of the bucket/feature it got dragged into, get the
        features of the song from Spotify, add to underlying buckets model,
        compute the widths, and update the bars UI.
    */
    updateResultsBars = async (songId, fromBucketName, toBucketName) => {
        console.log(
            "-----------------update results bars called---------------------"
        );
        console.log(songId);
        // get features from a new song
        const songFeatureObj = await createSongFeaturesObject(
            songId,
            this.state.cancel
        ).then((res) => {
            this.setState({ loading: false });
            return res;
        });

        // update bucket, calculate base widths, and update results bars
        if(fromBucketName !== "selected") {
            this.removeFromBuckets(songFeatureObj, this.buckets, fromBucketName);
        }
        if(toBucketName !== "selected") {
            this.addToBuckets(songFeatureObj, this.buckets, toBucketName);
        }
        this.setState({ targetAcc: calculateBaselines(this.buckets) });
        const songSuggestion = {};
        const featureRatios = computeWidthsForFeatures(
            this.state.targetAcc,
            songSuggestion
        );
        this.updateResultsItems(featureRatios);
    };

    componentDidMount() {
        this.updateResultsItems(undefined);
        // this.updateResultsBars("5IEP2NdoJtkoThS0fkZmap", "positivity");
    }

    handleMouseEnterTestRecSong = (recSongFeaturesObject) => {
        const featureRatios = computeWidthsForFeatures(
            this.state.targetAcc,
            recSongFeaturesObject
        );
        this.updateResultsItems(featureRatios);
    };

    handleMouseLeaveTestRecSong = () => {
        const featureRatios = computeWidthsForFeatures(
            this.state.targetAcc,
            {}
        );
        this.updateResultsItems(featureRatios);
    };

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

    /*
        Called when user enters anything into the search bar, will call fetchSearchResults
        to interact with spotify API
    */
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
    /*
        Called to fetch search results from spotify API
    */
    fetchSearchResults = (query) => {
        const searchUrl = `https://api.spotify.com/v1/search?query=${encodeURIComponent(
            query
        )}&type=track,artist`;
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
                isUpdate: false,
            },
            this.checkSearch()
        );
    };

    renderSearchResults = () => {
        if (
            Object.keys(this.state.results).length &&
            this.state.results.tracks.items.length
        ) {
            // get all songs
            const songs = this.state.results.tracks.items;

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

    /*
        Called to see the recommended songs and go back to feature cards
    */
    handleOnGoNBack = () => {
        var active = this.state.active;
        var newActive = active === 'CARDS' ? 'SONGS' : 'CARDS';
        this.setState({
            active: newActive
        });
    }

    render() {
        var active = this.state.active;

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
                        {active === "CARDS" ? (
                            <Dropzone
                            selectedSong={this.state.selectedSong}
                            selectedArtist={this.state.selectedArtist}
                            songID={this.state.songID}
                            isUpdate={this.state.isUpdate}
                            update={this.updateResultsBars}
                        />
                        ) : active === "SONGS" ? (
                            <RecomSongs
                            recomSongIds={this.state.recomSongIds}/>
                        ) : null}
                       
                        
                    </div>

                    <div className="results">
                        <p>Results</p>
                        <ResultsList items={this.state.resultsItems} />

                        <TestRecSongItem
                            songName="Perfect"
                            artist="Ed Sheeran"
                            energy="0.6"
                            instrumentalness="0.2"
                            positivity="0.7"
                            handleMouseEnter={this.handleMouseEnterTestRecSong}
                            handleMouseLeave={this.handleMouseLeaveTestRecSong}
                        />
                        <TestRecSongItem
                            songName="You Say Run"
                            artist="Hayashi Yuuki"
                            energy="0.9"
                            instrumentalness="0.9"
                            positivity="0.8"
                            handleMouseEnter={this.handleMouseEnterTestRecSong}
                            handleMouseLeave={this.handleMouseLeaveTestRecSong}
                        />
                        <TestRecSongItem
                            songName="YouSeeBIGGIRL/T:T"
                            artist="Hiroyuki Sawano"
                            energy="0.8"
                            instrumentalness="0.9"
                            positivity="0.1"
                            handleMouseEnter={this.handleMouseEnterTestRecSong}
                            handleMouseLeave={this.handleMouseLeaveTestRecSong}
                        />
                        <button type="button" onClick={this.handleOnGoNBack}>{active === "CARDS" ? (
                            <div>Go</div>
                        ) : active === "SONGS" ? (
                            <div>Back</div>
                        ) : null}</button>
                        
                    </div>
                </header>
            </div>
        );
    }
}
export default Dashboard;
