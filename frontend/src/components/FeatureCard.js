import React, { useCallback } from "react";
import "../styles/FeatureCard.css";

class FeatureCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                {/* Feature header */}
                <label htmlFor={this.props.feature + "Card"} className="header">
                    {this.props.feature}
                </label>

                {/* Songs text label */}
                <div className="song">
                    <p>Songs:</p>
                    <div className="song-list">
                        {this.props.list}
                    </div>
                </div>
            </div>
        );
    }
}

export default FeatureCard;
