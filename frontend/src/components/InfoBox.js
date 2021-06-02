import React from "react";
import "../styles/InfoBox.css";

class InfoBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="info-box">
                <p>{this.props.infoMessage}</p>
            </div>
        );
    }
}

export default InfoBox;
