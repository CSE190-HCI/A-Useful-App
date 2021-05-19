import React from "react";
import "../styles/Dropzone.css";
import FeatureCard from "./FeatureCard";


class Dropzone extends React.Component{
    constructor(props) {
        super(props);
    }

    state = {
        list:[{name:"song 1", status:"decided1"},
                {name:"song 2", status:"selected"},
                {name:"song 3", status:"decided2"},
                {name:"song 4", status:"decided3"}]
    }

    handleDragStart=(e,name)=>{
        console.log(name)
    e.dataTransfer.setData("id", name)
    }

    handleDragOver=(e)=>{
        e.preventDefault()
    }

    handleOnDrop=(e,status)=>{
        let id = e.dataTransfer.getData("id")
        console.log(this.state.list)
        let list = this.state.list.filter((task)=>{
            if(task.name===id){
                task.status=status
            }
            return task
        })

        this.setState({
            list:list
        })
    }

    render(){
        let obj={
            decided1:[],
            decided2:[],
            decided3:[],
            selected:[]
        }

        this.state.list.forEach(task => {
            obj[task.status].push (
                <div 
                onDragStart={(e)=>{this.handleDragStart(e, task.name)}}
                key = {task.name}
                draggable 
                className="draggable">{task.name}</div>
            )
        });
        return(
            <div >
                <div 
                onDragOver={(e) => this.handleDragOver(e)}
                onDrop={(e)=>this.handleOnDrop(e, "selected")}
                className="selected-container">
                    Selected Songs
                    {obj.selected}
                </div>

                <div 
                onDragOver={(e) => this.handleDragOver(e)}
                onDrop={(e)=>this.handleOnDrop(e, "decided1")}
                className="decided-container1">
                    <FeatureCard feature="Energy" list = {obj.decided1}/>
                </div>

                <div 
                onDragOver={(e) => this.handleDragOver(e)}
                onDrop={(e)=>this.handleOnDrop(e, "decided2")}
                className="decided-container2">
                    <FeatureCard feature="Instrumentalness" list = {obj.decided2}/>
                </div>

                <div 
                onDragOver={(e) => this.handleDragOver(e)}
                onDrop={(e)=>this.handleOnDrop(e, "decided3")}
                className="decided-container3">
                    <FeatureCard feature="Mood" list = {obj.decided3}/>
                </div>
            </div>
        )
    }
}

export default Dropzone;

