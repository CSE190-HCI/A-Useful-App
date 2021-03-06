import axios from "axios";
import { get } from "../utils/api";
import { ResultsItem, TotalBar } from "../components/ResultsList";

export const getParamValues = (url) => {
    return url
        .slice(1)
        .split("&")
        .reduce((prev, curr) => {
            const [title, value] = curr.split("=");
            prev[title] = value;
            return prev;
        }, {});
};
export const setAuthHeader = () => {
    try {
        const params = JSON.parse(localStorage.getItem("params"));
        if (params) {
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${params.access_token}`;
        }
    } catch (error) {
        console.log("Error setting auth", error);
    }
};

const convertToPercentage = (value) => {
    return Math.round((value / 1) * 100) + "%";
};

const computeWidths = (targetValue, suggestionValue) => {
    let greenWidth =
        suggestionValue >= targetValue
            ? convertToPercentage(suggestionValue)
            : convertToPercentage(0);
    let redWidth =
        suggestionValue < targetValue
            ? convertToPercentage(targetValue)
            : convertToPercentage(0);
    let baseWidth =
        suggestionValue < targetValue
            ? convertToPercentage(suggestionValue)
            : convertToPercentage(targetValue);
    return {
        baseWidth: baseWidth,
        redWidth: redWidth,
        greenWidth: greenWidth,
    };
};

/* Takes in two songFeatureObjects, and outputs featureRatios */
export const computeWidthsForFeatures = (target, songSuggestion) => {
    let featureRatios = {};
    for (const feature of Object.keys(target)) {
        featureRatios[feature] = computeWidths(
            target[feature],
            songSuggestion[feature]
        );
    }
    return featureRatios;
};

const normalize = (val, min, max) => {
    return (val - min) / (max - min);
};

const calculateEnergy = (audioFeatures) => {
    const average =
        (audioFeatures.energy +
            normalize(audioFeatures.loudness, -60, 0) +
            normalize(audioFeatures.tempo, 0, 247) +
            audioFeatures.danceability) /
        4;
    return average;
};
const calculateInstrumentalness = (audioFeatures) => {
    const average =
        (audioFeatures.instrumentalness + (1 - audioFeatures.speechiness)) / 2;
    return average;
};
const calculatePositivity = (audioFeatures) => {
    // console.log("calculatePositivity called");
    const average =
        (audioFeatures.valence * 0.5 + audioFeatures.mode * 0.5) / 2;
    return average;
};

export const extractFeaturesSync = (audioFeatures) => {
    return {
        energy: calculateEnergy(audioFeatures),
        instrumentalness: calculateInstrumentalness(audioFeatures),
        positivity: calculatePositivity(audioFeatures),
    };
};

const extractFeatures = (audioFeatures) => {
    // console.log("extract features called");
    return new Promise((resolve) => {
        // console.log(`promise resolved`);
        resolve({
            energy: calculateEnergy(audioFeatures),
            instrumentalness: calculateInstrumentalness(audioFeatures),
            positivity: calculatePositivity(audioFeatures),
        });
    }).then((res) => {
        return res;
    });
};

export const createSongFeaturesObject = async (songId, cancel) => {
    const getFeaturesUrl = `https://api.spotify.com/v1/audio-features/${songId}`;
    if (cancel) {
        // Cancel the previous request before making a new request
        cancel.cancel();
    }
    // Create a new CancelToken
    cancel = axios.CancelToken.source();

    return new Promise((resolve) => {
        get(getFeaturesUrl, {
            cancelToken: cancel.token,
        })
            .then((res) => {
                resolve(extractFeatures(res));
            })
            .catch((error) => {
                if (axios.isCancel(error) || error) {
                    console.log("Failed to fetch results.Please check network");
                }
            });
    });
};

export const returnResultsItems = (featureRatios) => {
    // console.log(featureRatios);
    if (
        !featureRatios ||
        !featureRatios.energy ||
        !featureRatios.instrumentalness ||
        !featureRatios.positivity ||
        !featureRatios.energy.baseWidth ||
        !featureRatios.instrumentalness.baseWidth ||
        !featureRatios.positivity.baseWidth
    )
        return <></>;
    return [
        featureRatios.energy.baseWidth === "0%" ? (
            <></>
        ) : (
            <ResultsItem
                feature="Energy"
                bar={<TotalBar widths={featureRatios.energy} />}
            />
        ),
        featureRatios.instrumentalness.baseWidth === "0%" ? (
            <></>
        ) : (
            <ResultsItem
                feature="Instrumentalness"
                bar={<TotalBar widths={featureRatios.instrumentalness} />}
            />
        ),
        featureRatios.positivity.baseWidth === "0%" ? (
            <></>
        ) : (
            <ResultsItem
                feature="Positivity"
                bar={<TotalBar widths={featureRatios.positivity} />}
            />
        ),
    ];
};

const calculateBaseline = (bucketName, bucket) => {
    if (bucket.length === 0) return 0;

    let sum = bucket.reduce((a, b) => {
        return a + b[bucketName];
    }, 0);

    return sum / bucket.length;
};

export const calculateBaselines = (buckets) => {
    let baselines = {};
    for (let bucket of Object.entries(buckets)) {
        const bucketName = bucket[0];
        let baseline = (baselines[bucketName] = calculateBaseline(...bucket));
        baselines[bucketName] = baseline;
    }
    return baselines;
};

export const hasSongList = (list, song) => {
    if (!list || !song) return false;
    for (const listSong of list) {
        if (listSong.songID === song.songID) return true;
    }
    return false;
};

export const hasSongComponentsList = (list, songID) => {
    // console.log(list);
    if (!list || !songID) return false;
    for (const component of list) {
        if (component.props.songID === songID) return true;
    }
    return false;
};

export const selectInfoMessage = (containerName) => {
    let message = <p>Hover over something to get more info</p>;
    switch (containerName) {
        case "decided-container1":
            message =
                <p><h1>Energy</h1> represents a perceptual measure of <b>intensity</b> and <b>activity</b>. Typically, energetic tracks feel <b>fast</b>, <b>loud</b>, and <b>noisy</b>. Specific audio features that map to energy include loudness, tempo, danceability, dynamic range, perceived loudness, timbre, onset rate, and general entropy.</p>;
            break;
        case "decided-container2":
            message =
                <p><h1>Instrumentalness</h1> is a predicted measure of whether or not a song <b>contains vocals</b>. The <i>greater</i> the instrumentalness value is, the greater likelihood the track contains <i>no vocal content</i>.</p>;
            break;
        case "decided-container3":
            message =
                <p><h1>Positivity</h1> describes the <b>musical positiveness</b> conveyed by a song. More <i>positive</i> songs will be more in a <i>major</i> key, and <i>less positive</i> songs will be more in a <i>minor</i> key.</p>;
            break;
        case "selected-container":
            message =
                <p><b>Click and drag</b> selected songs into the desired feature bucket to start.</p>;
            break;
        case "selected-songs-list":
            message =
                <p><b>Click and drag</b> selected songs into the desired feature bucket to start.</p>;
            break;
        case "text-field":
            message =
                <p><b>Search</b> for songs you wish to start blending. <b>Click on</b> the desired song to send it to the 'Selected Songs' section.</p>;
    }
    console.log(message);
    return message;
};

export const mapStatusToBucketName = (status) => {
    let bucketName = "selected";
    switch (status) {
        case "decided1":
            bucketName = "energy";
            break;
        case "decided2":
            bucketName = "instrumentalness";
            break;
        case "decided3":
            bucketName = "positivity";
            break;
        default:
            break;
    }
    return bucketName;
};

const euclideanDist = (a, targetAcc) => {
    return Math.sqrt(
        Math.pow(a.energy - targetAcc.energy, 2) +
        Math.pow(a.instrumentalness - targetAcc.instrumentalness, 2) +
        Math.pow(a.positivity - targetAcc.positivity, 2)
    );
}

export const compare = (a, b, targetAcc) => {
    const aEuclideanDist = euclideanDist(a, targetAcc);
    const bEuclideanDist = euclideanDist(b, targetAcc);
    console.log(aEuclideanDist, bEuclideanDist);
    return aEuclideanDist - bEuclideanDist;
}