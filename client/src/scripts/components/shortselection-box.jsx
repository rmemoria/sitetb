
import React from 'react';
import { ButtonGroup, Button } from 'react-bootstrap';
import { objEqual } from '../commons/utils';

export default class ShortSelectionBox extends React.Component { //TODOMS: trocar para listbox

	constructor(props) {
		super(props);
		this.itemClick = this.itemClick.bind(this);
		this.notifyChange = this.notifyChange.bind(this);

		// initialize an empty list of values
		this.state = { };
	}

	componentWillMount() {
		const value = this.props.value !== undefined ? this.props.value : null;
		this.setState({ value: value });
	}


	shouldComponentUpdate(nextProps, nextState) {
		return !objEqual(nextProps, this.props) || !objEqual(nextState, this.state);
	}

	/**
	 * Notify the parent about change in the selection
	 * @param  {[type]} value The new value selected
	 * @param  {[type]} evt   The control event, generated by react
	 */
	notifyChange(value, evt) {
		if (this.getValue() === value) {
			this._value = null;
			this.setState({ value: null });
		} else {
			this._value = value;
			this.setState({ value: value });
		}

		if (this.props.onChange) {
			this.props.onChange(evt, this.getValue());
		}
	}

	/**
	 * API exposed to the client to get its selected value.
	 * It is not in the state because when the event is generated, the state is not immediatelly
	 * updated
	 * @return {Array|Object} An array, if it is a multi-selection or the item selected in the option list
	 */
	getValue() {
		return this._value;
	}

	/**
	 * Return the rendered component for the label
	 * @return {React.Component} The label component, or null if there is no label
	 */
	labelRender() {
		const label = this.props.label;
		return label ? <label className="control-label">{label}</label> : null;
	}

	/**
	 * Return the item to be displayed
	 * @param  {Object} item The item to be displaye
	 * @return {[type]}      [description]
	 */
	getOptionDisplay(item) {
		const idisp = this.props.optionDisplay;
		if (!idisp) {
			return item;
		}

		if (typeof idisp === 'function') {
			return idisp(item);
		}

		if (typeof idisp === 'string') {
			return item[idisp];
		}

		return item;
	}

	/**
	 * Return the options to be displayed in the popup
	 * @return {[type]} [description]
	 */
	getOptions() {
		const options = this.props.options;
		if (!options) {
			return null;
		}

		return options;
	}

	/**
	 * Create the popup component to be displayed based on the options
	 * @return {React.Component} Popup component, or null if no option is found
	 */
	createItemList() {
		const options = this.getOptions();
		if (options === null) {
			return null;
		}

		// create the components
		const opts = options
			.map(item => {
				const aliClass = this.getTxtAlignClass();
				const btnClass = aliClass + (item === this.getValue() ? ' short-sel-item-selected' : ' short-sel-item');
				return (
					<Button className={btnClass}
						key={this.props.options.indexOf(item)}
						onClick={this.itemClick(item)}>
						{this.getOptionDisplay(item)}
					</Button>
				);
			});

		const ctrlClass = this.props.wrapperClassName;
		const controlClass = (this.props.vertical === true ? 'short-sel-list-v' : 'short-sel-list') + ' form-control' + (ctrlClass ? ' ' + ctrlClass : '');

		var ret = null;

		if (this.props.vertical === true && opts.length > 0) {
			ret = <ButtonGroup vertical className={controlClass}>{opts}</ButtonGroup>;
		} else if (opts.length > 0) {
			ret = <ButtonGroup justified className={controlClass}>{opts}</ButtonGroup>;
		}

		return ret;
	}

	getTxtAlignClass() {
		switch (this.props.textAlign) {
			case 'left': return 'text-left';
			case 'right': return 'text-right';
			default: return 'text-center';
		}
	}

	/**
	 * Called when user clicks on an item in the drop down
	 * @param  {[type]} item [description]
	 * @return {[type]}      [description]
	 */
	itemClick(item) {
		const self = this;
		return evt => {
			self.notifyChange(item, evt);
			return;
		};
	}

	/**
	 * Component rendering
	 * @return {React.Component} Component to display
	 */
	render() {
		const helpBlock = this.props.help ? (
				<div className="help-block">{this.props.help}</div>
			) : null;
		const clazz = 'short-sel-box' + (this.props.bsStyle ? ' has-' + this.props.bsStyle : '');

		return (
			<div className={clazz}>
				{this.labelRender()}
				{this.createItemList()}
				{helpBlock}
			</div>
			);
	}
}

ShortSelectionBox.propTypes = {
	label: React.PropTypes.node,
	optionDisplay: React.PropTypes.any, // TODOMS: testar se pode entrar um node, ou função e se funciona de boa
	options: React.PropTypes.array,
	onChange: React.PropTypes.func,
	value: React.PropTypes.any,
	bsStyle: React.PropTypes.oneOf(['success', 'warning', 'error']),
	help: React.PropTypes.string,
	wrapperClassName: React.PropTypes.string,
	textAlign: React.PropTypes.oneOf(['right', 'left', 'center']),
	vertical: React.PropTypes.bool
};

ShortSelectionBox.defaultProps = {
	textAlign: 'center',
	vertical: false
};
