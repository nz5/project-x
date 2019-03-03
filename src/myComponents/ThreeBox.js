import React, { Component } from 'react';
import './MyView.css'
import Cube from './3dComponents/Box/cube'

export default class ThreeBox extends Component {
    render() {
        return (
            <div className="MyView" id="3boxView">
                <Cube/>
            </div>
        );
    }
}