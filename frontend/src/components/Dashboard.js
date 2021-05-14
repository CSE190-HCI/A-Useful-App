import React from 'react';
import FeatureCard from "./FeatureCard";
const Dashboard = () => {
    return  <div>
                <header className="App-header">
                    <p>Web Name</p>                
                    <FeatureCard feature="Danceability"/>
                    <FeatureCard feature="Valence"/>
                    <FeatureCard feature="Tempo"/>
                </header>
            </div>;
};
export default Dashboard;