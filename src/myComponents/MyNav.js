import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './MyView.css'

import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import brandImage from '../pictures/brand.svg'

import MyViewHome from './MyViewHome';
import MyView3d from './MyView3D';
import ThreeBox from './3dComponents/Box/ThreeBox';
import ThreeClock from './3dComponents/Clock/three-clock.js';

export default class MyNav extends Component {

    render() {
        return (
            <div>
                <Router>
                    <div>
                        <Navbar bg="primary" variant="dark">
                            <Navbar.Brand href="/">
                                <img src={brandImage}
                                    width="60"
                                    height="60"
                                    className="d-inline-block align-top"
                                    alt="React Bootstrap logo"></img>
                            </Navbar.Brand>
                            <Nav className="mr-auto">
                                <Nav.Link href="/">Home</Nav.Link>
                                <NavDropdown title="3D" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/3box/">Box</NavDropdown.Item>
                                    <NavDropdown.Item href="/3Clock/">Clock</NavDropdown.Item>
                                    <NavDropdown.Item href="/3d/">Billiards</NavDropdown.Item>
                                    <NavDropdown.Item href="/3d/">Tetris</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.4">XXX</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar>
                        <Route path="/" exact component={MyViewHome} />
                        <Route path="/3d/" component={MyView3d} />
                        <Route path="/3box/" component={ThreeBox} />
                        <Route path="/3Clock/" component={ThreeClock} />

                    </div>
                </Router>

            </div>
        );
    }
}