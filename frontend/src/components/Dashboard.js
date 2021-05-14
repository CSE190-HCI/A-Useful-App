import React from 'react';
import FeatureCard from "./FeatureCard";
const Dashboard = () => {
    return  <div>
                <header className="App-header">
                    <p>Web Name</p>                
                    <FeatureCard feature="Energy"/>
                    <FeatureCard feature="Instrumentalness"/>
                    <FeatureCard feature="Mood"/>
                </header>
            </div>;
};
export default Dashboard;