import React, { Component } from 'react';
import '../../MyView.css'
import Cube from './cube'

export default class ThreeBox extends Component {
    render() {
        return (
            <div id="3boxView">
                <Cube />
            </div>
        );
    }
}