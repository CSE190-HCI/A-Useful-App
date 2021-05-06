import "./App.css";
import feature from "./components/FeatureCard.js";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <p>Web Name</p>
                {/* <feature feature="Danceability" />
                <feature feature="Valence" /> */}
            </header>
            <feature />
        </div>
    );
}

export default App;
