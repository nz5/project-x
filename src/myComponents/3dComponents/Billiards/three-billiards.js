import React, { Component } from 'react';
import '../../MyView.css'
import * as THREE from "three";
import initScene from './billiard'
import Footer from '../../Footer';


export default class ThreeBilliards extends Component {
    constructor(props) {
        super(props);
        this.bgColor = 0x282c34;
        this.viewId = '3billiards';
        this.state = {
            scene: new THREE.Scene(),
            renderer: new THREE.WebGLRenderer({ antialias: true }),
            canvasId: "myCanvas",
        };
    }

    componentDidMount() {
        initScene(this.state.scene, this.state.renderer, this.state.canvasId, this.bgColor, this.viewId);
    }

    componentWillUnmount() {
        const scene = this.state.scene;
        for (let i = scene.children.length - 1; i >= 0; i--) {
            const object = scene.children[i];
            if (object.type === 'Mesh') {
                object.geometry.dispose();
                object.material.dispose();
                scene.remove(object);
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
                <div id={this.viewId} />
                <Footer/>
            </div>

        );
    }
}