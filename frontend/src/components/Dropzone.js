import React from "react";
import "../styles/Dropzone.css";
import FeatureCard from "./FeatureCard";
import SearchDisplayItem from "./SearchDisplayList";

class Dropzone extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        list: [
            {
                name: this.props.selectedSong,
                artist: this.props.selectedArtist,
                songID: this.props.songID,
                status: "selected",
            },
        ],
        prev_status: "",
        songID: "",
    };

    static getDerivedStateFromProps(props, state) {
        if (props.isUpdate === true) {
            return {
                list: [
                    ...state.list,
                    {
                        name: props.selectedSong,
                        artist: props.selectedArtist,
                        songID: props.songID,
                        status: "selected",
                    },
                ],
            };
        }
    }

    handleDragStart = (e, name, songID, status) => {
        console.log(name);
        e.dataTransfer.setData("id", name);

        this.setState({
            prev_status: status,
            songID: songID,
        });
    };

    handleDragOver = (e) => {
        e.preventDefault();
    };

    mapStatusToBucketName = (status) => {
        let bucketName = "selected";
        switch (status) {
            case "decided1":
                bucketName = "energy";
                break;
            case "decided2":
                bucketName = "instrumentalness";
                break;
            case "decided3":
                bucketName = "positivity";
                break;
            default:
                break;
        }
        return bucketName;
    };

    handleOnDrop = (e, status) => {
        console.log(
            `before status was ${this.state.prev_status} and is now ${status}`
        );
        if (this.state.prev_status !== status) {
            this.props.update(
                this.state.songID,
                this.mapStatusToBucketName(status)
            );
        }

        let id = e.dataTransfer.getData("id");
        console.log(this.state.list);

        let list = this.state.list.filter((task) => {
            if (task.name === id) {
                task.status = status;
            }
            return task;
        });

        this.setState({
            list: list,
        });
    };

    render() {
        let obj = {
            decided1: [],
            decided2: [],
            decided3: [],
            selected: [],
        };

        console.log(obj);

        this.state.list.forEach((task) => {
            obj[task.status].push(
                <div
                    onDragStart={(e) => {
                        this.handleDragStart(
                            e,
                            task.name,
                            task.songID,
                            task.status
                        );
                    }}
                    key={task.songID}
                    draggable
                    className="draggable"
                >
                    {task.name} {task.artist}
                </div>
            );
        });
        return (
            <div>
                <div
                    onDragOver={(e) => this.handleDragOver(e)}
                    onDrop={(e) => this.handleOnDrop(e, "selected")}
                    className="selected-container"
                >
                    Selected Songs
                    {obj.selected}
                </div>

                <div
                    onDragOver={(e) => this.handleDragOver(e)}
                    onDrop={(e) => this.handleOnDrop(e, "decided1")}
                    className="decided-container1"
                >
                    <FeatureCard feature="Energy" list={obj.decided1} />
                </div>

                <div
                    onDragOver={(e) => this.handleDragOver(e)}
                    onDrop={(e) => this.handleOnDrop(e, "decided2")}
                    className="decided-container2"
                >
                    <FeatureCard
                        feature="Instrumentalness"
                        list={obj.decided2}
                    />
                </div>

                <div
                    onDragOver={(e) => this.handleDragOver(e)}
                    onDrop={(e) => this.handleOnDrop(e, "decided3")}
                    className="decided-container3"
                >
                    <FeatureCard feature="Positivity" list={obj.decided3} />
                </div>
            </div>
        );
    }
}

export default Dropzone;
