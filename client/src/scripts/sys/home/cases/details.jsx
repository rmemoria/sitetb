
import React from 'react';
import { Grid, Row, Col, DropdownButton, MenuItem, Nav, NavItem, Button } from 'react-bootstrap';
import { Card, WaitIcon, MessageDlg, Fa } from '../../../components';
import PatientPanel from '../commons/patient-panel';

import CaseData from './case-data';
import CaseExams from './case-exams';
import CaseTreatment from './case-treatment';
import CaseClose from './case-close';
import CaseMove from './case-move';
import CaseIssues from './case-issues';
import CaseTags from './case-tags';

import { generateName } from '../../mock-data';

const tags = [
	{
		id: '123456-1',
		name: 'Not on treatment',
		type: 'userdef'
	},
	{
		id: '123456-2',
		name: 'On treatment',
		type: 'userdef'
	},
	{
		id: '123456-3',
		name: 'Closed cases',
		type: 'warn'
	},
	{
		id: '123456-4',
		name: 'DR-TB with no resistance',
		type: 'danger'
	},
	{
		id: '123456-5',
		name: 'TB with resistance',
		type: 'danger'
	}
];


// TEMPORARY -> CASE DATA USED FOR PROTOTYPING
const caseMockData = {
	patient: {
		name: 'Jim Morrison',
		gender: 'MALE',
		birthDate: new Date(1970, 1, 1),
		motherName: 'Maria Morrison'
	},
	diagnosisDate: new Date(2016, 5, 1),
	age: 35,
	notificationUnit: {
		id: '123456-123355',
		name: 'Centro de Referência Prof Hélio Fraga',
		adminUnit: {
			id: '1234-1234',
			name: 'Rio de Janeiro, RJ'
		}
	},
	tags: tags,
	adverseReactions: [
		{
			id: '4848484-1',
			adverseReaction: { id: 1, name: 'Adverse Reaction 1' },
			medicine: 'Terizidon',
			month: 2
		},
		{
			id: '4848484-2',
			adverseReaction: { id: 2, name: 'Adverse Reaction 2' },
			medicine: 'Isoniazid',
			month: 5
		},
		{
			id: '4848484-3',
			adverseReaction: { id: 1, name: 'Adverse Reaction 3' },
			medicine: 'Amicacin',
			month: 8
		}
	],
	comments: [
		{
			id: '123456-12',
			user: {
				id: '12312312',
				name: 'Bruce Dickinson'
			},
			group: 'contacts',
			date: new Date(),
			comment: 'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum'
		},
		{
			id: '123456-11',
			user: {
				id: '12312312',
				name: 'Iron Maiden'
			},
			group: 'contacts',
			date: new Date(),
			comment: 'Contact Rubens Smith refused interview and moved out to another address'
		}
	]
};

export default class Details extends React.Component {

	constructor(props) {
		super(props);
		this.selectTab = this.selectTab.bind(this);
		this.show = this.show.bind(this);
		this.deleteConfirm = this.deleteConfirm.bind(this);

		this.state = { selTab: 0 };
	}

	componentWillMount() {
		setTimeout(() => {
			// contatos
			const contacts = [];
			for (var i = 0; i < 5; i++) {
				const res = generateName();
				contacts.push({
					id: res.id,
					name: res.name,
					gender: res.gender,
					age: res.age
				});
			}
			const data = Object.assign({}, caseMockData, { contacts: contacts });

			this.setState({
				tbcase: data
			});
		}, 100);
	}

	tagsRender() {
		const lst = this.state.tbcase.tags;

		if (!lst) {
			return null;
		}

		return (
			<div>
				{
					!lst ? <WaitIcon type="card" /> :
					lst.map(item => (
						<a key={item.id} className={'tag-link tag-' + item.type}>
							<div className="tag-title">{item.name}</div>
						</a>
					))
				}
			</div>
			);
	}

	selectTab(key) {
		this.setState({ selTab: key });
	}

	show(cpt, show) {
		const self = this;
		return () => {
			const obj = {};
			obj[cpt] = show;
			self.setState(obj);
		};
	}

	deleteConfirm(action) {
		if (action === 'yes') {
			alert('TODOMS: delete this item on DB');
		}

		this.setState({ showDelConfirm: false });
	}

	render() {
		const tbcase = this.state.tbcase;

		if (!tbcase) {
			return <WaitIcon type="page" />;
		}

		const seltab = this.state.selTab;

		const tabs = (
			<Nav bsStyle="tabs" activeKey={seltab}
				onSelect={this.selectTab}
				className="app-tabs">
				<NavItem key={0} eventKey={0}>{'Data'}</NavItem>
				<NavItem key={1} eventKey={1}>{'Follow-up'}</NavItem>
				<NavItem key={2} eventKey={2}>{'Treatment'}</NavItem>
				<NavItem key={3} eventKey={3}>{'Issues'}</NavItem>
			</Nav>
			);

		const tagh = (<span>
						<h4 className="inlineb mright">
							{'Tags'}
						</h4>
						<Button onClick={this.show('showTagEdt', true)} bsSize="small">
							<Fa icon="pencil"/>
						</Button>
					</span>);

		return (
			<div>
				<PatientPanel patient={tbcase.patient} recordNumber={tbcase.recordNumber} />
				<Grid fluid>
					<Row className="mtop">
						<Col sm={3}>
							<DropdownButton id="ddcase" bsStyle="danger" title={__('form.options')} >
								<MenuItem eventKey={1} onSelect={this.show('showDelConfirm', true)}>{__('cases.delete')}</MenuItem>
								<MenuItem eventKey={1} onSelect={this.show('showCloseCase', true)}>{__('cases.close')}</MenuItem>
								<MenuItem eventKey={1} onSelect={this.show('showMoveCase', true)}>{__('cases.move')}</MenuItem>
							</DropdownButton>
							<Card className="mtop" header={tagh}>
							{
								this.tagsRender()
							}
							</Card>
							<Card title="Other cases of this patient" />
						</Col>
						<Col sm={9}>
							{tabs}
							{seltab === 0 && <CaseData tbcase={tbcase} />}
							{seltab === 1 && <CaseExams tbcase={tbcase} />}
							{seltab === 2 && <CaseTreatment tbcase={tbcase} />}
							{seltab === 3 && <CaseIssues tbcase={tbcase} />}
						</Col>
					</Row>
				</Grid>

				<MessageDlg show={this.state.showDelConfirm}
					onClose={this.deleteConfirm}
					title={__('action.delete')}
					message={__('form.confirm_remove')} style="warning" type="YesNo" />

				<CaseClose show={this.state.showCloseCase} onClose={this.show('showCloseCase', false)} tbcase={tbcase}/>

				<CaseMove show={this.state.showMoveCase} onClose={this.show('showMoveCase', false)} tbcase={tbcase}/>

				<CaseTags show={this.state.showTagEdt} onClose={this.show('showTagEdt', false)} tbcase={tbcase}/>

			</div>
			);
	}
}
