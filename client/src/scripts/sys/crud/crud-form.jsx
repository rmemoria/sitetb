
import React from 'react';
import { FormDialog, WaitIcon } from '../../components';

export default class CrudForm extends React.Component {

	constructor(props) {
		super(props);

		this.saveForm = this.saveForm.bind(this);
	}

	componentWillMount() {
		const self = this;
		const handler = this.props.controller.on(evt => {
			if (evt === 'open-form' || evt === 'close-form') {
				// check if this form should handle events
				if (!self.isFormVisible()) {
					return;
				}
				self.setState({ visible: evt === 'open-form' });
			}
		});
		this.setState({ handler: handler, visible: self.isFormVisible() });
	}

	componentWillUnmount() {
		this.props.controller.removeListener(this.state.handler);
	}

	saveForm() {
		return this.props.controller.saveAndClose(this.state.doc, this.state.id);
	}

	closeForm() {
		this.props.controller.closeForm();
	}

	/**
	 * Return true if form is visible
	 * @return {Boolean} [description]
	 */
	isFormVisible() {
		const ctrl = this.props.controller;
		return ctrl.isFormOpen() &&
			((ctrl.isNewForm() && this.props.openOnNew) || (!ctrl.isNewForm() && this.props.openOnEdit));
	}

	render() {
		if (!this.state.visible) {
			return null;
		}

		const controller = this.props.controller;

		return controller.formInfo.fetching ?
			<WaitIcon type="card" /> :
			<FormDialog schema={this.props.schema}
				doc={controller.formInfo.doc}
				onConfirm={this.saveForm}
				cardWrap={this.props.cardWrap}
				onCancel={controller.closeForm}/>;
	}
}

CrudForm.propTypes = {
	schema: React.PropTypes.object,
	controller: React.PropTypes.object.isRequired,
	openOnNew: React.PropTypes.bool,
	openOnEdit: React.PropTypes.bool,
	cardWrap: React.PropTypes.bool
};

CrudForm.defaultProps = {
	cardWrap: true
};
