
import React from 'react';
import { Alert } from 'react-bootstrap';
import { WaitIcon, Errors } from '../../components';
import { getValue } from '../../commons/utils';
import { arrangeGrid } from '../../commons/grid-utils';


/**
 * Create the form content for the given form component
 * @param  {Form} form The form component
 * @return {React.Component} The rendered form content
 */
export default function formRender(form) {
	if (!form.state.resources) {
		return <WaitIcon type="card" />;
	}

	let errors = form.props.errors;

	const handledErrors = [];

	// check if there is any global error message
	let globalMsg = errors instanceof Error ? errors.message : null;

	// is not a list of error messages ?
	if (errors instanceof Error) {
		errors = null;
	}

	const snapshots = form.state.snapshots;

	// create the list of components and its size
	const items = snapshots.map(item => {
		const snapshot = item.snapshot;
		const compErrors = snapshot.property ? propertyErrors(snapshot.property, errors, handledErrors) : null;
		const value = snapshot.property ? getValue(form.props.doc, snapshot.property) : null;

		const comp = createElement(form, item, value, compErrors);

		const size = snapshot.size ? snapshot.size : { sm: 12 };
		return { size: size, content: comp };
	});

	const lst = arrangeGrid(items);

	// called after the elements loop to search for unhandled messages
	if (!globalMsg) {
		globalMsg = createGlobalMsgs(errors, handledErrors);
	}

	// is there a global message
	if (globalMsg) {
		return (
			<div>
				<Alert bsStyle="danger">{globalMsg}</Alert>
				{lst}
			</div>
			);
	}

	return lst;
}

/**
 * Create the component of a given schema
 * @param  {[type]} schema [description]
 * @param  {[type]} value  [description]
 * @param  {[type]} errors [description]
 * @return {[type]}        [description]
 */
function createElement(form, item, value, errors) {
	const snapshot = item.snapshot;
	// get any resource that came from the object
	const res = form.state.resources[snapshot.id];

	// simplify error handling, sending just a string if there is
	// just one single error for the property
	let err;
	if (errors && errors.length === 1 && snapshot && errors[0].field === snapshot.property) {
		err = errors[0].msg;
	}
	else {
		err = errors;
	}

	const Comp = item.comp;

	if (__DEV__) {
		if (!Comp) {
			throw new Error('Invalid type: ' + snapshot.type);
		}
	}

	return (
		<Comp ref={snapshot.id}
			schema={snapshot}
			value={value}
			resources={res}
			onChange={form._onChange}
			errors={err}
			onRequest={form._onRequest} />
		);
}

/**
 * Return a list of errors of a specific field
 * @param  {[type]} propname [description]
 * @param  {[type]} errors   [description]
 * @return {[type]}          [description]
 */
function propertyErrors(propname, errors, handledErrors) {
	if (!errors) {
		return null;
	}

	const res = errors.filter(msg => {
		if (msg.field && msg.field.startsWith(propname)) {
			handledErrors.push(msg.field);
			return true;
		}
		return false;
	});

	return res.length === 0 ? null : res;
}


/**
 * Create a list of global messages based on unhandled messages by the fields
 * @return {[type]} [description]
 */
function createGlobalMsgs(errors, handledErrors) {
	if (!errors) {
		return null;
	}

	const lst = errors.filter(msg => handledErrors.indexOf(msg.field) === -1);

	return lst.length > 0 ? <Errors messages={lst} /> : null;
}
