import React from "react";

import TestRecSongItem from "./TestRecSongItem";
import { SearchDisplayList, SearchDisplayItem } from "./SearchDisplayList";
import { ResultsList } from "./ResultsList";
import RecomSongs from "./RecomSongs";
import InfoBox from "./InfoBox";

import "../styles/Dashboard.css";
import Dropzone from "./Dropzone";
import {
    computeWidthsForFeatures,
    createSongFeaturesObject,
    returnResultsItems,
    calculateBaselines,
    extractFeaturesSync
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

            searchStyle: {
                top: 0,
                left: 0,
                width: 0,
            },
            preventSearchDisappear: false,
            searchAppear: false,

            isUpdate: false,
            selectedSong: "",
            selectedArtist: "",
            songID: "",

            resultsItems: [],
            targetAcc: {},

            infoMessage: "",

            // switch between FeatureCards and RecomSongs
            displayCards: "block",
            displaySongs: "none",
            active: "CARDS",
            // update this from backend recommendations
            recomSongIds: [],
            recomSongs: [],
            refreshSongs: false,
        };

        this.cancel = "";
    }

    songCat = {
        energy: [],
        instrumentalness: [],
        positivity: [],
    };

    buckets = {
        energy: [
            // { energy: 0.85, instrumentalness: 0.45, positivity: 0.75 }
        ],
        instrumentalness: [],
        positivity: [],
    };

    /* 
        A function to add a songFeaturesObject to the right bucket of the
        underlying buckets model.
     */
    addToBuckets = (songFeaturesObject, buckets, bucket) => {
        buckets[bucket].push(songFeaturesObject);
    };

    addToCats = (songId, toBucketName) => {
        this.songCat[toBucketName].push(songId);
        // console.log(this.songCat);
    };

    removeFromCats = (songId, fromBucketName) => {
        const index = this.songCat[fromBucketName].indexOf(songId);
        this.songCat[fromBucketName].splice(index, 1);
        // console.log(this.songCat);
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
        // get features from a new song
        const songFeatureObj = await createSongFeaturesObject(
            songId,
            this.state.cancel
        ).then((res) => {
            // console.log(res);
            this.setState({ loading: false });
            return res;
        });

        // update bucket, calculate base widths, and update results bars
        if (fromBucketName !== "selected") {
            this.removeFromBuckets(
                songFeatureObj,
                this.buckets,
                fromBucketName
            );
            this.removeFromCats(songId, fromBucketName);
        }
        if (toBucketName !== "selected") {
            this.addToBuckets(songFeatureObj, this.buckets, toBucketName);
            this.addToCats(songId, toBucketName);
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
        // console.log(
        //     `PreventSearchDisappear is now ${this.state.preventSearchDisappear}`
        // );
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
                // console.log(res);
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
        // console.log(
        //     `this.state is now ${this.state.selectedSong}, ${this.state.selectedArtist}, ${this.state.songID}`
        // );
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
        // console.log("handleMouseEnter is called");
        this.setState({
            preventSearchDisappear: true,
        });
    };

    handleMouseLeave = () => {
        // console.log("handleMouseLeave is called");
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
        // console.log(this.state.resultsItems);
        // displayCards, displaySongs
        var displayCards = this.state.displayCards;
        var displaySongs = this.state.displaySongs;
        var newDisplayCards = displayCards === "block" ? "none" : "block";
        var newDisplaySongs = displaySongs === "block" ? "none" : "block";

        var active = this.state.active;
        var newActive = active === "CARDS" ? "SONGS" : "CARDS";
        this.setState({
            active: newActive,
            displayCards: newDisplayCards,
            displaySongs: newDisplaySongs,
        });
        if (this.state.active === "SONGS") {
            this.setState({
                recomSongIds: [],
                recomSongs: [],
            });
        }
        // get song ids in three cats -> backend -> update recomsongids
        if (this.state.active === "CARDS") {
            fetch("/recommend_songs", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ songCat: this.songCat }),
            })
                .then((res) => res.json())
                .then((res) => {
                    /* RES IS AN ARRAY OF FEATURES OF REC SONGS */
                    for (const song of res) {
                        this.setState({
                            recomSongIds: this.state.recomSongIds.concat(
                                song.id
                            ),
                        });
                    }                    
                })
                .then(this.refreshRecomSongIds);
        }
    };

    refreshRecomSongIds = () => {
        var recomSongIds = this.state.recomSongIds;
        var songId;
        for (songId of recomSongIds) {
            console.log(songId);
            const searchUrl = `https://api.spotify.com/v1/tracks/${songId}`;
            const getFeaturesUrl = `https://api.spotify.com/v1/audio-features/${songId}`;
            get(searchUrl).then((res) => {
                get(getFeaturesUrl).then((features) => {        
                    this.setState({
                        recomSongs: [
                            ...this.state.recomSongs,
                            {
                                image: res.album.images[0].url,
                                name: res.name,
                                url: res.href,
                                ...extractFeaturesSync(features)
                            },
                        ],
                        refreshSongs: true,
                    });
                })
            });
        }
    };
    handleMouseEnterInfoMessage = (infoMessage) => {
        this.setState({
            infoMessage: infoMessage,
        });
    };

    render() {
        var active = this.state.active;
        // console.log(this.state);
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
                        <div style={{ display: this.state.displayCards }}>
                            <Dropzone
                                selectedSong={this.state.selectedSong}
                                selectedArtist={this.state.selectedArtist}
                                songID={this.state.songID}
                                isUpdate={this.state.isUpdate}
                                update={this.updateResultsBars}
                                infoFunction={this.handleMouseEnterInfoMessage}
                            />
                        </div>

                        {active !== "CARDS" && (
                            <RecomSongs
                                recomSongs={this.state.recomSongs}
                                refreshSongs={this.state.refreshSongs}
                                handleMouseEnter={this.handleMouseEnterTestRecSong}
                                handleMouseLeave={this.handleMouseLeaveTestRecSong}
                            />
                        )}
                    </div>

                    <div className="results">
                        <p>Results</p>
                        <ResultsList items={this.state.resultsItems} />

                        {/* <TestRecSongItem
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
                        /> */}
                        <button type="button" onClick={this.handleOnGoNBack}>
                            {active === "CARDS" ? (
                                <div>Go</div>
                            ) : active === "SONGS" ? (
                                <div>Back</div>
                            ) : null}
                        </button>

                        <InfoBox infoMessage={this.state.infoMessage}></InfoBox>
                    </div>
                </header>
            </div>
        );
    }
}
export default Dashboard;
