import React from "react";
// import { render } from "react-dom";
// import Checkbox from "./Checkbox.js";
import "../styles/FeatureCard.css";

// export default class feature extends React.Component {
//     state = { checked: false };

//     handleCheckboxChange = (event) => {
//         this.setState({ checked: event.target.checked });
//     };
//     render() {
//         return (
//             <div style={{ fontFamily: "system-ui" }}>
//                 <label>
//                     <Checkbox
//                         checked={this.state.checked}
//                         onChange={this.handleCheckboxChange}
//                     />
//                     <span style={{ marginLeft: 8 }}>Label Text</span>
//                 </label>
//             </div>
//         );
//     }
// }

// render(<feature />, document.getElementById("root"));

function FeatureCard(props) {
    return (
        <div className="container">
            {/* Feature header */}
            <div className="header">
                <p>{props.feature}</p>
                {/* <Checkbox title={"hi"} checked={this.state.checked} /> */}
                {/* <Text> {"hello"} </Text> */}
            </div>

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

export default FeatureCard;
