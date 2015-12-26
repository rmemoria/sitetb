
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { TB_SET } from './actions';
import { app } from './app';

/**
 * The home page of the initialization module
 */
export default class Toolbar extends React.Component {

    constructor() {
        super();
        this._onAppChange = this._onAppChange.bind(this);
    }

    componentDidMount() {
        app.add(this._onAppChange);
    }

    componentWillUmount() {
        app.remove(this._onAppChange);
    }

    _onAppChange(action, data) {
        if (action === TB_SET) {
            this.setState({ toolbarContent: data.toolbarContent });
        }
    }

    render() {
        var Logo = (
            <a>
                <img src="images/logo2.png"></img>
            </a>
        );

        var state = this.state || {};

        const items = (state.toolbarContent && state.toolbarContent(app)) || <Nav navbar />;

        return (
            <Navbar className="header" fixedTop inverse>
                <Navbar.Header>
                    <Navbar.Brand>
                        {Logo}
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                {items}
            </Navbar>
        );
    }
}
