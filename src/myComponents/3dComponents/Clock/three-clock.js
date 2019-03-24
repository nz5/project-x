import React, { Component } from 'react';
import '../../MyView.css'
import initScene from './clock';
import * as THREE from "three";
import Footer from '../../Footer';



export default class ThreeClock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scene: new THREE.Scene(),
            renderer: new THREE.WebGLRenderer({antialias: true}),
            canvasId: "myCanvas"
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
                <div id="3clockView" />
                <Footer/>
            </div>
        );
    }
}