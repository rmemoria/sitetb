import React from 'react';
import { Grid, Row, Col, Input, Button, Fade, OverlayTrigger, Popover } from 'react-bootstrap';
import { navigator } from '../components/router.jsx';
import Title from '../components/title.jsx';


export default class Success extends React.Component {
    constructor(props) {
        super(props);
        this.contClick = this.contClick.bind(this);
    }

    /**
     * Called when user clicks on the continue button
     */
    contClick() {
        navigator.goto('/init/newworkspace');
    }


    /**
     * Render the component
     */
    render() {
        let msg = this.props.appState.message;

        return (
            <Fade in transitionAppear>
                <Grid>
                    <Row>
                        {msg}
                    </Row>
                </Grid>
            </Fade>
        );
    }
}