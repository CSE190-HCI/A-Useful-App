import React from "react";
import "../styles/FeatureCard.css";

class FeatureCard extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            isCheck : false
        };
    }

    handleChange = (e) => {
        this.setState({ ...this.state, isCheck: e.target.checked });
    }
    
    render(){

        return(
            <div className="container">
                
                {/* Feature header */}
                <label for={this.props.feature + "Card"} className="header">
                    <input
                        type="checkbox"
                        id={this.props.feature + "Card"}
                        checked={this.state.isCheck}
                        onChange={e => this.handleChange(e)}
                    />
                    {this.props.feature}
                </label>

                {/* Song text label */}
                <div className="song">
                    <p>Song: </p>
                </div>

                {/* Input text field */}
                <input
                    type="text"
                    placeholder="Search for a song..."
                    className="text-field"
                />
            </div>
        );
    }
}

export default FeatureCard;
