from requests.api import get
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import credentials

client_cred = SpotifyClientCredentials(client_id=credentials.SPOTIPY_CLIENT_ID, \
                                       client_secret=credentials.SPOTIPY_CLIENT_SECRET)
spotify = spotipy.Spotify(client_credentials_manager=client_cred)


def get_audio_features(song_id):
    results = spotify.audio_features([song_id])
    return results

# Test get_audio_features
song_id = '5bC7bZtKUa4nxbp6bEoDuY'
print(get_audio_features(song_id))

