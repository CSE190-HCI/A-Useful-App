import React from "react";
import "../styles/Dropzone.css";
import FeatureCard from "./FeatureCard";
import { hasSongList, hasSongComponentsList } from "../utils/functions.js";

class Dropzone extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        list: [
            // {
            //     name: this.props.selectedSong,
            //     artist: this.props.selectedArtist,
            //     songID: this.props.songID,
            //     status: "selected",
            // },
        ],
        prev_status: "",
        songID: "",
    };

    static getDerivedStateFromProps(props, state) {
        let newSong = {
            name: props.selectedSong,
            artist: props.selectedArtist,
            songID: props.songID,
            status: "selected",
        };

        if(hasSongList(state.list, newSong)) return state.list;

        if (props.isUpdate === true) {
            return {
                list: [
                    ...state.list,
                    newSong,
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

    handleOnDrop = (e, status, componentsList) => {
        /* if drag from any non-selected bucket to selected, delete */
        if(this.state.prev_status !== "selected" && status === "selected") {

            /* delete from and update list */
            let list = this.state.list.filter(song => {
                return !(song.songID === this.state.songID && song.status === this.state.prev_status);
            });
            this.setState({
                list: list
            });

            /* update dashboard's underlying buckets model */
            this.props.update(
                this.state.songID,
                this.mapStatusToBucketName(this.state.prev_status),
                this.mapStatusToBucketName(status)
            );

            return;
        }
        
        /* otherwise, avoid duplicate songs in each bucket, including selected */
        if(hasSongComponentsList(componentsList, this.state.songID)) return;

        /* update dashboard's underlying buckets model */
        if (this.state.prev_status !== status) {
            this.props.update(
                this.state.songID,
                this.mapStatusToBucketName(this.state.prev_status),
                this.mapStatusToBucketName(status)
            );
        }

        let id = e.dataTransfer.getData("id");
        console.log(this.state.list);

        let cloneTask = undefined;
        
        let list = this.state.list.filter((task) => {
            /* Identify songs by name and status */
            if (task.name === id && task.status === this.state.prev_status) {
                if(this.state.prev_status === "selected") {
                    cloneTask = JSON.parse(JSON.stringify(task));
                    cloneTask.status = status;
                } else {
                    task.status = status;
                }
            }
            return task;
        });

        if(cloneTask) {
            this.setState({
                list: [...list, cloneTask],
            });
        } else {
            this.setState({
                list: list
            });
        }
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
                    onDrop={(e) => this.handleOnDrop(e, "selected", obj.selected)}
                    className="selected-container"
                >
                    Selected Songs
                    {obj.selected}
                </div>

                <div
                    onDragOver={(e) => this.handleDragOver(e)}
                    onDrop={(e) => this.handleOnDrop(e, "decided1", obj.decided1)}
                    className="decided-container1"
                >
                    <FeatureCard feature="Energy" list={obj.decided1} />
                </div>

                <div
                    onDragOver={(e) => this.handleDragOver(e)}
                    onDrop={(e) => this.handleOnDrop(e, "decided2", obj.decided2)}
                    className="decided-container2"
                >
                    <FeatureCard
                        feature="Instrumentalness"
                        list={obj.decided2}
                    />
                </div>

                <div
                    onDragOver={(e) => this.handleDragOver(e)}
                    onDrop={(e) => this.handleOnDrop(e, "decided3", obj.decided3)}
                    className="decided-container3"
                >
                    <FeatureCard feature="Positivity" list={obj.decided3} />
                </div>
            </div>
        );
    }
}

export default Dropzone;
