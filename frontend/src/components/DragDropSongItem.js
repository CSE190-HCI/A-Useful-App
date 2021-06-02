import React from "react";
import "../styles/DragDropSongItem.css";

class DragDropSongItem extends React.Component {
	handleDragStart = (e) => {
		this.props.handleDragStart(
			e,
			this.props.name,
			this.props.songID,
			this.props.status
		);
	};

    handleDelete = (e) => {
        this.props.handleDelete(e);
    }

    handleMouseOver = (e) => {
        this.props.handleMouseOver(e, this.props.status, this.props.songID);
    }

	render() {
		return (
			<div
				onDragStart={(e) => {
					this.handleDragStart(e);
				}}
				key={this.props.songID + this.props.status}
				draggable
				className={this.props.status}
			>
                <div className="drag-song-container">
                    <div className="drag-song-labels">
                        <label className="drag-song-name"> {this.props.name} </label>
                        <label className="drag-artist"> {this.props.artist} </label>
                    </div>
                    {this.props.status === "selected"
                        ? 
                        <div className="drag-song-delete-btn-container">
                            <button
                                type="button"
                                className="drag-song-delete-btn"
                                onClick={(e) => this.handleDelete(e)}
                                onMouseOver={(e) => this.handleMouseOver(e)}>
                                x
                            </button>
                        </div>
                        :
                        <div className="drag-song-delete-btn-container">
                        <button
                            type="button"
                            className="drag-song-delete-btn">
                            x
                        </button>
                    </div>
                    }
                </div>
			</div>
		);
	}
}

export default DragDropSongItem;
