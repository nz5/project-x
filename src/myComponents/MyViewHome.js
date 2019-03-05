import React, { Component } from 'react';
import './MyView.css';
import ControlledCarousel from './bootstrapComponents/ControlledCarousel';

import 'aframe';
import 'aframe-react';
// import 'aframe-particle-system-component';
// import {Entity, Scene} from 'aframe-react';

export default class MyViewHome extends Component {


    render() {
        return (
            <div className="GradientBackground">
            {/* <ControlledCarousel /> */}
                  {/* <Scene>
        <Entity geometry={{primitive: 'box'}} material={{color: 'red'}} position={{x: 0, y: 0, z: -5}}/>
        <Entity particle-system={{preset: 'snow'}}/>
        <Entity light={{type: 'point'}}/>
        <Entity gltf-model={{src: 'virtualcity.gltf'}}/>
        <Entity text={{value: 'Hello, WebVR!'}}/>
      </Scene> */}
                {/* <iframe allowFullScreen="yes" width="100%" height="100%" allowFullScreen="yes" allowvr="yes">
                    <a-box position="1 0.5 -10"
                        rotation="0 45 0"
                        color="#4CC3D9" />
                    <a-sphere position="-2 1.25 -10"
                        radius="1.25"
                        color="#EF2D5E"></a-sphere>
                    <a-box position="-1 0.5 -7"
                        rotation="0 45 0" width="1" height="1" depth="1" color="#4CC3D9"></a-box>
                    <a-cylinder position="1 0.75 -8"
                        radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
                    <a-plane position="0 0 0"
                        rotation="-90 0 0" width="40" height="80" color="#7BC8A4"></a-plane>
                </iframe> */}
                {/* <a-scene embedded>
                    <a-box position="1 0.5 -10"
                        rotation="0 45 0"
                        color="#4CC3D9" />
                    <a-sphere position="-2 1.25 -10"
                        radius="1.25"
                        color="#EF2D5E"></a-sphere>
                    <a-box position="-1 0.5 -7"
                        rotation="0 45 0" width="1" height="1" depth="1" color="#4CC3D9"></a-box>
                    <a-cylinder position="1 0.75 -8"
                        radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
                    <a-plane position="0 0 0"
                        rotation="-90 0 0" width="40" height="80" color="#7BC8A4"></a-plane>
                </a-scene> */}
            </div>

        );
    }
}
