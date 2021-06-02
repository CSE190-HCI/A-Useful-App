import React from "react";
import "../styles/Dropzone.css";
import FeatureCard from "./FeatureCard";
import DragDropSongItem from "./DragDropSongItem";
import {
    hasSongList,
    hasSongComponentsList,
    mapStatusToBucketName,
    selectInfoMessage,
} from "../utils/functions.js";

class Dropzone extends React.Component {

    state = {
        list: [],
        prev_status: "",
        songID: ""
    };

    

    static getDerivedStateFromProps(props, state) {
        let newSong = {
            name: props.selectedSong,
            artist: props.selectedArtist,
            songID: props.songID,
            status: "selected",
        };

        if (hasSongList(state.list, newSong)) return state.list;

        if (props.isUpdate === true) {
            return {
                list: [...state.list, newSong],
            };
        }
        return null;
    }

    handleDragStart = (e, name, songID, status) => {
        // console.log(name);
        e.dataTransfer.setData("id", name);

        this.setState({
            prev_status: status,
            songID: songID,
        });
    };

    handleDragOver = (e) => {
        e.preventDefault();
    };

    deleteSong = (list, status) => {
        /* delete from and update list */
        let newList = list.filter((song) => {
            return !(
                song.songID === this.state.songID &&
                song.status === this.state.prev_status
            );
        });
        this.setState({
            list: newList,
        });

        /* update dashboard's underlying buckets model */
        this.props.update(
            this.state.songID,
            mapStatusToBucketName(this.state.prev_status),
            mapStatusToBucketName(status)
        );
    };

    handleOnDrop = (e, status, componentsList) => {
        /* if drag from any non-selected bucket to selected, delete */
        if (this.state.prev_status !== "selected" && status === "selected") {
            this.deleteSong(this.state.list, status);
            return;
        }

        /* otherwise, avoid duplicate songs in each bucket, including selected */
        if (hasSongComponentsList(componentsList, this.state.songID)) return;

        /* update dashboard's underlying buckets model */
        if (this.state.prev_status !== status) {
            this.props.update(
                this.state.songID,
                mapStatusToBucketName(this.state.prev_status),
                mapStatusToBucketName(status)
            );
        }

        let id = e.dataTransfer.getData("id");

        let cloneTask = undefined;

        let list = this.state.list.filter((task) => {
            /* Identify songs by name and status */
            if (task.name === id && task.status === this.state.prev_status) {
                if (this.state.prev_status === "selected") {
                    cloneTask = JSON.parse(JSON.stringify(task));
                    cloneTask.status = status;
                } else {
                    task.status = status;
                }
            }
            return task;
        });

        if (cloneTask) {
            this.setState({
                list: [...list, cloneTask],
            });
        } else {
            this.setState({
                list: list,
            });
        }
    };

    handleDelete = (e, status) => {
        this.deleteSong(this.state.list, status);
    };

    handleMouseOverForDelete = (e, status, songID) => {
        this.setState({
            songID: songID,
            prev_status: status,
        });
    };

    handleMouseEnterInfo = (e) => {
        console.log(e.target.className);
        this.props.infoFunction(selectInfoMessage(e.target.className));
    };

    handleMouseLeaveInfo = (e) => {
        // console.log(e);
        this.props.infoFunction(selectInfoMessage(""));
    };

    render() {
        let obj = {
            decided1: [],
            decided2: [],
            decided3: [],
            selected: [],
        };

        this.state.list.forEach((task) => {
            obj[task.status].push(
                <DragDropSongItem
                    name={task.name}
                    artist={task.artist}
                    songID={task.songID}
                    status={task.status}
                    handleDragStart={this.handleDragStart}
                    handleDelete={(e) => this.handleDelete(e, task.status)}
                    handleMouseOver={(e) =>
                        this.handleMouseOverForDelete(
                            e,
                            task.status,
                            task.songID
                        )
                    }
                />
            );
        });

        return (
            <div style={{display: this.state.display}}>
                <div
                    onMouseEnter={(e) => this.handleMouseEnterInfo(e)}
                    onMouseLeave={(e) => this.handleMouseLeaveInfo(e)}
                    onDragOver={(e) => this.handleDragOver(e)}
                    onDrop={(e) =>
                        this.handleOnDrop(e, "selected", obj.selected)
                    }
                    className="selected-container"
                >
                    Selected Songs
                    <div className="selected-songs-list">{obj.selected}</div>
                </div>

                <div
                    onDragOver={(e) => this.handleDragOver(e)}
                    onDrop={(e) =>
                        this.handleOnDrop(e, "decided1", obj.decided1)
                    }
                    onMouseEnter={(e) => this.handleMouseEnterInfo(e)}
                    onMouseLeave={(e) => this.handleMouseLeaveInfo(e)}
                    className="decided-container1"
                >
                    <FeatureCard feature="Energy" list={obj.decided1} />
                </div>

                <div
                    onDragOver={(e) => this.handleDragOver(e)}
                    onDrop={(e) =>
                        this.handleOnDrop(e, "decided2", obj.decided2)
                    }
                    onMouseEnter={(e) => this.handleMouseEnterInfo(e)}
                    onMouseLeave={(e) => this.handleMouseLeaveInfo(e)}
                    className="decided-container2"
                >
                    <FeatureCard
                        feature="Instrumentalness"
                        list={obj.decided2}
                    />
                </div>

                <div
                    onDragOver={(e) => this.handleDragOver(e)}
                    onDrop={(e) =>
                        this.handleOnDrop(e, "decided3", obj.decided3)
                    }
                    onMouseEnter={(e) => this.handleMouseEnterInfo(e)}
                    onMouseLeave={(e) => this.handleMouseLeaveInfo(e)}
                    className="decided-container3"
                >
                    <FeatureCard feature="Positivity" list={obj.decided3} />
                </div>
            </div>
        );
    }
}

export default Dropzone;
