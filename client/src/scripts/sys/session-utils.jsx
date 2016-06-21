import React from 'react';
import { app } from '../core/app';

export default class SessionUtils {

	/**
	 * Redirect to the home page of the application
	 * @return {[type]} [description]
	 */
	static gotoHome() {
		window.location.hash = SessionUtils.homeHash();
	}

	/**
	 * Return the URL hat must be used in the home link of the toolbar
	 * @return {[type]} [description]
	 */
	static homeHash() {
		const session = app.getState().session;
		switch (session.view) {
			case 'COUNTRY': return SessionUtils.workspaceHash();
			case 'ADMINUNIT': return '#/sys/home/adminunit';
			// default is the unit page
			default: return SessionUtils.unitHash();
		}
	}

	static workspaceHash(defaultView) {
		return '#/sys/home/workspace' + (defaultView ? defaultView : '');
	}

	static unitHash(unitId, defaultView) {
		const url = '#/sys/home/unit' + (defaultView ? defaultView : '') + '?id=';
		return url + (unitId ? unitId : app.getState().session.unitId);
	}

	static adminUnitHash(auId, defaultView) {
		return '#/sys/home/adminunit' + (defaultView ? defaultView : '') + '?id=' + auId;
	}

	static caseHash(caseId) {
		return '#/sys/home/cases/details?id=' + caseId;
	}

	/**
	 * Generate a node component to display the full name of an administrative unit
	 * followed by its links. If addWorkspace is true, a second line is included with the workspace name
	 * @param  {[type]} adminUnit    [description]
	 * @param  {[type]} addWorkspace [description]
	 * @return {[type]}              [description]
	 */
	static adminUnitDisplay(adminUnit, addWorkspace) {
		const lst = [];

		// admin unit was informed ?
		if (adminUnit) {
			const keys = Object.keys(adminUnit);
			keys.forEach((k, index) => {
					const item = adminUnit[k];
					const hash = SessionUtils.adminUnitHash(item.id);
					lst.push(<a key={index} href={hash}>{item.name}</a>);

					if (index < keys.length - 1) {
						lst.push(<span key={'s' + index}>{', '}</span>);
					}
				});
		}

		return (
			<div>
				{lst}
				{
					addWorkspace &&
					<div>
						<a href={SessionUtils.workspaceHash()}>{app.getState().session.workspaceName}</a>
					</div>
				}
			</div>
			);
	}
}