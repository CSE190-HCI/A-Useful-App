import "./App.css";
import FeatureCard from "./components/FeatureCard";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <p>Web Name</p>
                <FeatureCard feature="Danceability"/>
                <FeatureCard feature="Valence"/>
                <FeatureCard feature="Tempo"/>
            </header>
            <feature />
        </div>
    );
}

export default App;
