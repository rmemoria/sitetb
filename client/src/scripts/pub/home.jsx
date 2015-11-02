'use strict';

import React from 'react';
import { RouteView } from '../components/router.jsx';

/** Pages of the public module */
import Login from './login.jsx';
import UserReg from './user-reg.jsx';
import ForgotPwd from './forgot-pwd.jsx';


/**
 * The page controller of the public module
 */
export default class Home extends React.Component {

	render() {
		let routes = [
			{ path: '/login', view: Login },
            { path: '/forgotpwd', view: ForgotPwd},
            { path: '/userreg', view: UserReg }
		];

		let viewProps = {
			dispatch: this.props.dispatch,
			appState: this.props.appState
		};

		return (
			<div>
	            <RouteView routes={routes} viewProps={viewProps}>
	            </RouteView>
			</div>
			);
	}
}