import React, { Component } from 'react';
import '../../MyView.css'
import Footer from '../../Footer';
import initScene from './cube';
import * as THREE from "three";



export default class ThreeBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scene: new THREE.Scene(),
            renderer: new THREE.WebGLRenderer({ antialias: true }),
            canvasId: "cubeCanvas"
        };
    }

    componentDidMount() {
        initScene(this.state.scene, this.state.renderer, this.state.canvasId);
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
                <div id="3boxView" />
                <Footer />
            </div>
        );
    }
}