from flask import flask
from flask.app import Flask

def create_app():
  app = Flask(__name__)

  return app


lient_cred = SpotifyClientCredentials(client_id=credentials.SPOTIPY_CLIENT_ID, \
                                       client_secret=credentials.SPOTIPY_CLIENT_SECRET)
spotify = spotipy.Spotify(client_credentials_manager=client_cred)


def get_audio_features(song_id):
    results = spotify.audio_features([song_id])
    return results

# cat1_songs = ['5bC7bZtKUa4nxbp6bEoDuY', '5bC7bZtKUa4nxbp6bEoDuY']
# cat2_songs = ['5bC7bZtKUa4nxbp6bEoDuY']
# cat3_songs = ['5bC7bZtKUa4nxbp6bEoDuY']
# songs_lst = {'cat1': cat1_songs, 'cat2': cat2_songs, 'cat3': cat3_songs}

song_features = ['danceability','energy','loudness','mode','speechiness','acousticness',
                     'instrumentalness', 'liveness','valence','tempo']
all_features = ['id', 'name', 'artists','danceability','energy','loudness', 'mode',
 'speechiness','acousticness','instrumentalness', 'liveness','valence','tempo']


category_dict = {'cat1': ["energy", "loudness", "tempo", "danceability"],
                'cat2': ["instrumentalness", "speechiness", "liveness", "acousticness"],
                'cat3': ["valence", "mode"]}
song_df = pd.read_csv('tracks.csv')

@app.route('/recommend_songs', methods=['POST'])
def recommend_song():
  if request.method == 'POST':
    songs_lst = request.json
    songs_vector = {}
    for category in songs_lst:
        if songs_lst[category]:
          for song_id in songs_lst[category]:
              features_dict = get_audio_features(song_id)[0]

              for f in category_dict[category]:
                  if f in songs_vector:
                      songs_vector[f] = np.mean([songs_vector[f],features_dict[f]])
                  else:
                      songs_vector[f] = features_dict[f]

    input_vector = []
    for f in song_features:
      input_vector.append(songs_vector[f])

    sub_song_df = song_df[song_features]

    #calculate similarity
    results = list(cosine_similarity(np.array(input_vector).reshape((1, -1)), sub_song_df).reshape(-1))
    #return results
    song_tuples = list(zip(song_df['id'], results))

    top_recs = sorted(song_tuples, key = lambda x: x[1], reverse = True)[:5]
    top_recs_ids = [i[0] for i in top_recs]

    final_df = song_df[song_df['id'].isin(top_recs_ids)][all_features]
    # final_df = final_df[['id', 'name', 'artists', 'energy', 'instrumentalness', 'valence']]
    final_lst = final_df.to_dict(orient='records')
    return json.dumps(final_lst)


if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0')