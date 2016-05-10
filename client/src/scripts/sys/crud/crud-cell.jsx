import React from 'react';
import { ButtonToolbar, Button, Collapse, DropdownButton, MenuItem } from 'react-bootstrap';
import CrudController from './crud-controller';
import CrudForm from './crud-form';
import { Card, Expandable, AsyncButton, Fa } from '../../components';
import controlWrapper from './crud-control-wrapper';


/**
 * Component to control the displaying inside of a cell in a react grid
 */
class CrudCell extends React.Component {

	constructor(props) {
		super(props);

		this.expandRender = this.expandRender.bind(this);
		this.editClick = this.editClick.bind(this);
		this.deleteClick = this.deleteClick.bind(this);
		this.selectMenu = this.selectMenu.bind(this);
	}

	componentWillMount() {
		// resolve the item given by the controller
		const item = this.props.controller.itemById(this.props.id);
		if (__DEV__) {
			if (!item) {
				throw new Error('Item not found');
			}
		}

		this.setState({ item: item });
	}

	componentWillReceiveProps(props) {
		this.setState({ item: props.controller.itemById(props.id) });
	}

	/**
	 * Called when clicking in the drop down menu to prevent the cell to collapse
	 * @param  {MouseSyntheticEvent} evt The information about the event
	 */
	optionsClick(evt) {
		evt.preventDefault();
	}

	eventHandler(evt, data) {
		if (data && data.id !== this.props.id) {
			return;
		}

		const controller = this.props.controller;

		switch (evt) {
			case 'close-form':
				this.props.cell.setSize(null);
				return;
			case 'item-updated':
				this.setState({ item: controller.itemById(data.id) });
				return;
			case 'open-form':
				this.forceUpdate();
				return;
			default:
				return;
		}
	}

	/**
	 * Called when user clicks on the edit button
	 */
	editClick(evt) {
		evt.preventDefault();

		const cell = this.props.cell;
		const item = this.state.item;

		const controller = this.props.controller;

		controller
			.openForm(item)
			.then(() => {
				cell.setSize({ sm: 12 });
			})
			.catch(() => cell.forceUpdate());

		this.forceUpdate();
	}

	/**
	 * Called when user clicks on the delete button
	 */
	deleteClick(evt) {
		evt.preventDefault();

		this.props.controller.initDelete(this.state.item);
	}

	/**
	 * Called when user selects a popup option
	 * @param  {SyntheticEvent} evt The event generated by the control
	 * @param  {any} key The selected option
	 */
	selectMenu(evt, key) {
		// is delete clicked ?
		if (key === 'del') {
			this.deleteClick(evt);
			return;
		}
		const item = this.props.options[key];
		item.onClick();
	}

	_expandRenderEvt(item, cell) {
		try {
			return this.props.onExpandRender ? this.props.onExpandRender(item, cell) : null;
		} catch (err) {
			if (__DEV__) {
				console.error('Error calling event onExpandRender in CrudCell ', err);
			}
			return null;
		}
	}

	/**
	 * Render the content of the expandable area when user clicks on the cell
	 * @return {React.Component} The content of the expandable area
	 */
	expandRender() {
		const item = this.state.item;
		const cell = this.props.cell;

		const content = this._expandRenderEvt(item, cell);
		const controller = this.props.controller;

		const options = this.props.options;

		// check if displays the delete button or a group of options
		let btn;
		if (options) {
			btn = (
				<DropdownButton title={<Fa icon="gear"/>}
					onClick={this.optionsClick}
					id="itopt"
					onSelect={this.selectMenu}>
					{
						options.map((menu, index) =>
							<MenuItem key={index} eventKey={index}>
								{menu.label}
							</MenuItem>
							)
					}
					<MenuItem divider />
					<MenuItem eventKey="del">{__('action.delete')}</MenuItem>
				</DropdownButton>
				);
		}
		else {
			btn = (
				<Button bsStyle="link"
					onClick={this.deleteClick}>
					{__('action.delete')}
				</Button>
			);
		}

		return (
			<div>
				{content}
				<ButtonToolbar className="mtop">
					<AsyncButton bsStyle="primary"
						fetching={controller.frm && controller.frm.fetching}
						onClick={this.editClick}>
						{__('action.edit')}
					</AsyncButton>
					{btn}
				</ButtonToolbar>
			</div>
			);
	}


	cellRender(item) {
		try {
			return this.props.onRender(item);
		} catch (err) {
			if (__DEV__) {
				console.error('CrudCell - Error calling onRender: ', err);
			}
			return null;
		}

	}

	render() {
		const controller = this.props.controller;

		// get the form id being edited
		if (controller.getFormItemId() === this.props.id && !controller.frm.fetching) {
			return (
				<Collapse in transitionAppear>
					<CrudForm schema={this.props.editorSchema} className="highlight"
						modalShow
						wrapType={this.props.modal ? 'modal' : 'card'}
						controller={controller} openOnEdit />
				</Collapse>
				);
		}

		// return the content to be displayed
		return (
			<Card className="collapse-card" padding="small">
				<Expandable onExpandRender={this.expandRender}>
				{
					this.cellRender(this.state.item)
				}
				</Expandable>
			</Card>
			);
	}
}

CrudCell.propTypes = {
	id: React.PropTypes.any.isRequired,
	controller: React.PropTypes.instanceOf(CrudController).isRequired,
	cell: React.PropTypes.any,
	onRender: React.PropTypes.func,
	onExpandRender: React.PropTypes.func,
	editorSchema: React.PropTypes.object,
	options: React.PropTypes.array,
	// if true, editor will be displayed in a modal dialog
	modal: React.PropTypes.bool
};

export default controlWrapper(CrudCell);
