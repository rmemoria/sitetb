import React from 'react';
import { Grid, Col, Row, DropdownButton, MenuItem } from 'react-bootstrap';
import { Card, WaitIcon, Fa } from '../../../components';
import Form from '../../../forms/form';
import { server } from '../../../commons/server';
import TreatProgress from './treat-progress';
import TreatTimeline from './treat-timeline';
import { mockTreatment } from '../../mock-data';
import AddMedicine from './treat/add-medicine';


export default class CaseTreatment extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			sc1: {
				layout: [
					{
						property: 'regimen.name',
						type: 'string',
						label: 'Regimen',
						visible: doc => doc.regimen.id === doc.iniRegimen.id,
						size: { md: 12 }
					},
					{
						type: 'text',
						property: 'Started as {iniRegimen.name}\n{regimen.name}',
						label: 'Regimen',
						visible: doc => doc.regimen.id !== doc.iniRegimen.id,
						size: { md: 12 }
					},
					{
						type: 'text',
						property: '{period.ini} to {period.end}',
						label: __('cases.treat'),
						size: { md: 12 }
					}
				]
			}
		};

		this.menuClick = this.menuClick.bind(this);
		this.closeDlg = this.closeDlg.bind(this);
	}

	componentWillMount() {
		const self = this;
		server.get('/api/cases/treatment/c0a80169-54de-12c2-8154-de6e55500002')
		.then(() => {
			self.setState({ data: mockTreatment });
		});
	}

	menuClick(key) {
		if (key === 1) {
			this.setState({ show: 'add-med' });
			return;
		}
	}

	closeDlg() {
		this.setState({ show: null });
	}

	render() {
		const data = this.state.data;

		if (!data) {
			return <WaitIcon type="card" />;
		}

		const optionsBtn = (
			<DropdownButton className="lnk-muted" bsStyle="link"
				title={<Fa icon="cog" />} id="ttmenu" pullRight
				onSelect={this.menuClick}>
				<MenuItem eventKey={1}>{__('Regimen.add')}</MenuItem>
				<MenuItem eventKey={2}>{__('cases.regimens.change')}</MenuItem>
				<MenuItem eventKey={3}>{__('cases.treat.undo')}</MenuItem>
			</DropdownButton>
			);

		return (
			<div>
				<Card title={__('cases.details.treatment')}>
					<Grid fluid>
						<Row>
							<Col md={6}>
								<Form doc={data} schema={this.state.sc1} readOnly />
							</Col>
							<Col md={6}>
								<TreatProgress value={data.progress}/>
							</Col>
						</Row>
					</Grid>
				</Card>

				<Card title={__('cases.details.treatment.prescmeds')} headerRight={optionsBtn}>
					<TreatTimeline treatment={data} />
				</Card>

				<Card title={__('cases.details.treatment.medintake')}>
				</Card>
				{
					this.state.show === 'add-med' && <AddMedicine doc={{}} onClose={this.closeDlg}/>
				}
			</div>
			);
	}
}

CaseTreatment.propTypes = {
	tbcase: React.PropTypes.object
};
