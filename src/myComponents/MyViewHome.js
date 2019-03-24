import React, { Component } from 'react';
import './MyView.css';
import Footer from './Footer';
import ThreeClockCamera from './3dComponents/Clock-camera/three-clock-camera';



export default class MyViewHome extends Component {
    render() {
        return (
            <div>
            <ThreeClockCamera/>
            <Footer />
            </div>
        );
    }
}
