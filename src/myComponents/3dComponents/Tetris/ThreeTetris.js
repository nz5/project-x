import React, { Component } from 'react';
import '../../MyView.css'
import './tetris.css'
import * as THREE from "three";
import initScene from './three-code/tetris';

export default class ThreeTetris extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scene: new THREE.Scene(),
            renderer: new THREE.WebGLRenderer({ antialias: true }),
            canvasId: "myTetrisCanvas",
            canvasParentId: "myTetrisCanvasParent"
        };
    }

    componentDidMount() {
        initScene(this.state.scene,
            this.state.renderer,
            this.state.canvasId,
            this.state.canvasParentId)

    }

    componentWillUnmount() {
        const scene = this.state.scene;
        for (let i = scene.children.length - 1; i >= 0; i--) {
            const object = scene.children[i];
            if (object.type === 'Mesh') {
                object.geometry.dispose();
                object.material.dispose();
            }
            scene.dispose();
            scene.remove(object);
        }

        const element = document.getElementById(this.state.canvasId);
        element.parentNode.removeChild(element);

    }

    render() {
        return (
            <div>
                <div id={this.state.canvasParentId} />
                {/* <Footer/> */}
            </div>
        );
    }
}