import React from 'react';
import { Button } from 'react-bootstrap';
import { Card } from '../../components';
import { hasPerm } from '../session';
import CrudMessage from './crud-message';
import CrudPagination from './crud-pagination';
import CrudGrid from './crud-grid';
import CrudController from './crud-controller';

/**
 * Aggregate all crud component offering a full stack crud editor
 */
export default class CrudView extends React.Component {

	componentWillMount() {
		// the controller options
		const opts = {
			pageSize: this.props.pageSize,
			readOnly: !hasPerm(this.props.perm)
		};

		this.setState({ controller: new CrudController(this.props.crud, opts) });
	}

	render() {
		const controller = this.state.controller;

		return (
			<Card title={this.props.title}>
				<Button className="pull-right" onClick={this.openNewForm}>
					{__('action.add')}
				</Button>
				<CrudMessage controller={controller} />
				<CrudPagination controller={controller} showCounter />
				<CrudGrid controller={controller}
					onRender={this.props.onCellRender}
					onExpandRender={this.props.onDetailRender}
					editorSchema={this.props.editorDef} />
				<CrudPagination controller={controller} />
			</Card>
			);
	}
}


CrudView.propTypes = {
	title: React.PropTypes.string,
	editorDef: React.PropTypes.object,
	onCellRender: React.PropTypes.func,
	onDetailRender: React.PropTypes.func,
	beforeEdit: React.PropTypes.func,
	cellSize: React.PropTypes.object,
	perm: React.PropTypes.string,
	crud: React.PropTypes.object.isRequired,
	search: React.PropTypes.bool,
	pageSize: React.PropTypes.number,
	queryFilters: React.PropTypes.object,
	// if true, the card will have no bottom margin
	combine: React.PropTypes.bool,
	children: React.PropTypes.node
};

CrudView.defaultProps = {
	search: false,
	paging: false,
	cellSize: { md: 6 }
};
