
import React from 'react';
import { MenuItem } from 'react-bootstrap';
import Popup from './popup';
import { objEqual } from '../commons/utils';

/**
 * A component that allows use to select a single or multiple elements from a drop down
 * selection box.
 */
export default class SelectionBox extends React.Component {

    constructor(props) {
        super(props);
        this.controlClick = this.controlClick.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.btnCloseClick = this.btnCloseClick.bind(this);
        this.notifyChange = this.notifyChange.bind(this);
        this.noSelClick = this.noSelClick.bind(this);
        this.btnKeyPress = this.btnKeyPress.bind(this);

        // initialize an empty list of values
        this.state = { };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !objEqual(nextProps, this.props) || !objEqual(nextState, this.state);
    }

    /**
     * Notify the parent about change in the selection
     * @param  {[type]} value The new value selected
     * @param  {[type]} evt   The control event, generated by react
     */
    notifyChange(value) {
        this._value = value;

        if (this.props.onChange) {
            this.props.onChange(value);
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

        const values = this.props.value;
        if (this.props.mode === 'single' || !values) {
            return options;
        }

        // filter the items to display just the not selected options
        return options.filter(item => values.indexOf(item) === -1);
    }

    /**
     * Create the popup component to be displayed based on the options
     * @return {React.Component} Popup component, or null if no option is found
     */
    createPopup() {
        const options = this.getOptions();
        if (options === null) {
            return null;
        }

        // create the components
        const opts = options
            .map(item => {
                return (
                    <MenuItem key={this.props.options.indexOf(item)}
                        onSelect={this.itemClick(item)}>
                        {this.getOptionDisplay(item)}
                    </MenuItem>
                );
            });

        // check if an item for no selection should be included
        const noSelLabel = this.props.noSelectionLabel;
        if (noSelLabel && this.props.mode === 'single') {
            opts.unshift(<MenuItem key={-1} onSelect={this.noSelClick}>{noSelLabel}</MenuItem>);
        }

        return opts.length > 0 ? <Popup ref="popup">{opts}</Popup> : null;
    }

    /**
     * Called when user clicks on the close button of the item
     * @param  {object} item The item to be removed
     */
    btnCloseClick(item) {
        const self = this;
        return evt => {
            const values = self.props.value;
            const index = values.indexOf(item);
            values.splice(index, 1);
            this.notifyChange(values);
            evt.stopPropagation();
        };
    }

    /**
    * Called when user clicks on the control
    **/
    controlClick() {
        if (!this.refs.popup) {
            return;
        }

        this.refs.popup.show();
    }

    /**
     * Called when user clicks on an item in the drop down
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    itemClick(item) {
        const self = this;
        return () => {
            if (self.props.mode === 'single') {
                self.notifyChange(item);
                return;
            }

            const values = this.props.value ? this.props.value : [];
            values.push(item);
            self.notifyChange(values.slice(0));
            self.refs.popup.preventHide();
        };
    }

    /**
     * Called when user clicks on the option representing no selection
     * @param  {[type]} evt [description]
     * @return {[type]}     [description]
     */
    noSelClick() {
        this.notifyChange(null);
    }

    /**
     * Rendering of the control content
     * @return {React.Component} The component to be displayed inside the control
     */
    contentRender() {
        const value = this.props.value;
        if (value === null || value === undefined) {
            return null;
        }

        // is a single value selection ?
        if (this.props.mode === 'single') {
            // display the single value
            return this.getOptionDisplay(value);
        }

        const lst = this.props.value;
        // create the list of selected values
        const items = lst.map(item =>
            <span key={lst.indexOf(item)} className="sel-box-item">
                <a className="btn-close" onClick={this.btnCloseClick(item)}>
                    <i className="fa fa-close"/>
                </a>
                {this.getOptionDisplay(item)}
            </span>
        );

        return <div className="sel-box-items">{items}</div>;
    }

    btnKeyPress(evt) {
        // check if it is arrow down
        if (evt.keyCode === 40) {
            evt.preventDefault();
            this.controlClick();
        }
    }

    getDOMNode() {
        return this.refs.btn;
    }

    /**
     * Component rendering
     * @return {React.Component} Component to display
     */
    render() {
        const clazz = 'sel-box form-group' + (this.props.bsStyle ? ' has-' + this.props.bsStyle : '');

        const helpBlock = this.props.help ? (
                <div className="help-block">{this.props.help}</div>
            ) : null;

        const ctrlClass = this.props.wrapperClassName;
        const controlClass = 'form-control' + (ctrlClass ? ' ' + ctrlClass : '');

        return (
            <div className={clazz}>
                {this.labelRender()}
                <button ref="btn" className={controlClass} onClick={this.controlClick}
                    onKeyDown={this.btnKeyPress}>
                    <div className="btn-dd">
                        <i className="fa fa-chevron-down" />
                    </div>
                    {this.contentRender()}
                </button>
                {this.createPopup()}
                {helpBlock}
            </div>
            );
    }
}

SelectionBox.propTypes = {
    label: React.PropTypes.node,
    optionDisplay: React.PropTypes.any,
    options: React.PropTypes.array,
    onChange: React.PropTypes.func,
    mode: React.PropTypes.oneOf(['single', 'multiple']),
    value: React.PropTypes.any,
    bsStyle: React.PropTypes.oneOf(['success', 'warning', 'error']),
    help: React.PropTypes.string,
    wrapperClassName: React.PropTypes.string,
    noSelectionLabel: React.PropTypes.string
};

SelectionBox.defaultProps = {
    mode: 'single'
};
