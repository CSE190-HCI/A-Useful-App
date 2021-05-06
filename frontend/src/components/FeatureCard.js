import React from "react";
// import { render } from "react-dom";
import Checkbox from "./Checkbox.js";
import "../styles/FeatureCard.css";

export default class feature extends React.Component {
    state = { checked: false };

    handleCheckboxChange = (event) => {
        this.setState({ checked: event.target.checked });
    };
    render() {
        return (
            <div style={{ fontFamily: "system-ui" }}>
                <label>
                    <Checkbox
                        checked={this.state.checked}
                        onChange={this.handleCheckboxChange}
                    />
                    <span style={{ marginLeft: 8 }}>Label Text</span>
                </label>
            </div>
        );
    }
}

// render(<feature />, document.getElementById("root"));

// function FeatureCard() {
//     return (
//         <div className="container">
//             <Checkbox title={"hi"} checked={this.state.checked} />
//             {<Text> {"hello"} </Text>}
//             <input
//                 type="text"
//                 placeholder="Search for a song..."
//                 className="text-field"
//             ></input>
//         </div>
//     );
// }

// export default FeatureCard;
