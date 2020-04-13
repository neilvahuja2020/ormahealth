import _ from 'lodash';
import React, { Component } from 'react';
import {Header, 
  Image, 
  Modal, 
  Button, 
  Comment,
  Form,
  Card,
  Label,
  Tab,
  Divider,
  Select,
  Table,
  Menu,
} from 'semantic-ui-react';
import ErrorBoundary from "react-error-boundary";
import styled from '@emotion/styled';
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
} from 'recharts';
import Moment from 'react-moment';
import 'moment-timezone';
import { updateNote, updateNewMessage, updateMessageRead } from './useMembers';
import Jdenticon from 'react-jdenticon';


const Description = styled.div`
  color: grey;
  font-size: 0.5em;
  font-weight: normal;
  line-height: normal
` 
function CustomizedAxisTick(props){
  const {
    x, y, payload,
  } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={0} 
        y={0} 
        dy={8} 
        fontSize='0.75em'
        textAnchor="end" 
        fill="#666" 
        transform="rotate(-30)">{(new Date(payload.value)).toLocaleDateString()}
      </text>
    </g>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div style={{backgroundColor: 'rgba(200, 200, 200, 0.3)'}}>
        <Moment
          format='MM/DD/YYYY, hh:mm A'
          tz='America/Los_Angeles' 
          date={label}/>
        <p>measurement: <span style={{fontWeight: 'bold'}}>{payload?payload[0].value:null}</span></p>
      </div>
    );
  }

  return null;
};

export default class MemberModal extends Component {

  constructor(props){
    super(props);
    this.state = {note: '', message: ''};
    this.handleNoteChange = this.handleNoteChange.bind(this);
  }

  handleNoteChange = event => {
    this.setState({note: event.target.value});
  }

  handleMessageChange = (event, {options, value}) => {
    const text = _.find(options, {'value': value}).text;
    this.setState({message: text});
  }

  handleNoteSubmit = event => {
    
    let members = this.props.members;
    const time = new Date().toISOString();
    members[this.props.selectedMemberIdx].noteData.unshift({value: this.state.note, 
                                time:time,
                                by: this.props.currentUserName,
                                email: this.props.currentUserEmail});
    members[this.props.selectedMemberIdx].latestNote = this.state.note;
    members[this.props.selectedMemberIdx].latestNoteDT = time;

    this.props.onMemberDataChange(members);
    this.setState({note: ''});

    updateNote(this.props.selectedMemberPhone, 
              this.state.note, 
              time, 
              this.props.currentUserName, 
              this.props.currentUserEmail);

  }

  handleMessageSubmit = event => {
    
    let members = this.props.members;
    const time = new Date().toISOString();
    members[this.props.selectedMemberIdx].messageData.unshift({value: this.state.message, 
                                time:time,
                                by: this.props.currentUserName,
                                email: this.props.currentUserEmail});

    this.props.onMemberDataChange(members);
    this.setState({message: ''});

    updateNewMessage(this.props.selectedMemberPhone, 
              this.state.message, 
              time, 
              this.props.currentUserName, 
              this.props.currentUserEmail);
  }

  handleMessageRead = event => {

    let members = this.props.members;
    const time = new Date().toISOString();
    _.each(members[this.props.selectedMemberIdx].messageData, d => {d.isRead = true;});
    members[this.props.selectedMemberIdx].numUnreadMessages = 0;
    this.props.onMemberDataChange(members);
    updateMessageRead(this.props.selectedMemberPhone);
  }


  render(){

    const member = this.props.members[this.props.selectedMemberIdx];

    const messageTemplates = (member?[
      {key: 'reminder', value: 'reminder', 
      text: ('Hi '+ member.name + ', ' + 
          'this is ' + this.props.currentUserName + ' from ABC Care. ' +
          'Could you measure your body weight/blood pressure when you have a chance today?')},
      {key: 'schedule', value: 'schedule', 
      text: ('Hi '+ member.name + ', ' + 
          'this is ' + this.props.currentUserName + ' from ABC Care. ' +        
          `Let's schedule a telehealth visit! When you have a chance, please call XXX-XXX-XXXX to schedule the visit.`)},
      {key: 'goodwork', value: 'goodwork', 
      text: ('Hi '+ member.name + ', ' + 
          'this is ' + this.props.currentUserName + ' from ABC Care. ' +        
          `Keep up the good work!`)},
      {key: 'support', value: 'support', 
      text: ('Hi '+ member.name + ', ' + 
          'this is ' + this.props.currentUserName + ' from ABC Care. ' +
          'If you are having troubles with your devices, ' + 
            'you can email help@ormahealth.com for support.')}      
    ]:[]);

    const panes = [
      {menuItem: (<Menu.Item key='Notes'>Notes</Menu.Item>), 
        render: ()=>(
         <Tab.Pane>
          <Form reply>
            <Form.TextArea 
              placeholder='Leave a note.'
              rows={2} 
              value={this.state.note}
              onChange={this.handleNoteChange}/>
            <Button 
              content='Add Note' 
              labelPosition='left' 
              icon='edit'
              onClick={this.handleNoteSubmit} 
              primary />
          </Form>
          <Comment.Group style={{maxWidth: '100%'}}>
            {_.map(member.noteData, (d) => (
              <Comment key={d.time}>
                <div style={{width: '40px', minHeight: '40px', float: 'left', margin: '.2em 0 0'}}>
                  <Jdenticon size='35' value={d.by}></Jdenticon>
                </div>
                <Comment.Content>
                  <Comment.Author as='a'>{d.by}</Comment.Author>
                  <Comment.Metadata>
                    <Moment
                      format='MM/DD/YYYY, hh:mm A'
                      tz='America/Los_Angeles' 
                      date={d.time}/>
                  </Comment.Metadata>
                  <Comment.Text>
                    {d.value}
                  </Comment.Text>
                </Comment.Content>
              </Comment>
            ))}
          </Comment.Group>
        </Tab.Pane>
      )},
      {menuItem: (<Menu.Item key='messages' onClick={this.handleMessageRead}>
                    Messages {(member && member.numUnreadMessages>0) && <Label>{member.numUnreadMessages}</Label>}
                  </Menu.Item>), 
        render: ()=>(
         <Tab.Pane>
          <Form reply>
            <Select placeholder='Select a message template' 
              options={messageTemplates} 
              onChange={this.handleMessageChange}
              style={{width:'100%', margin: '0 0 1em'}}/>
            <Button 
              content='Send Text Message' 
              labelPosition='left' 
              icon='send'
              onClick={this.handleMessageSubmit} 
              primary />
          </Form>
          <Comment.Group style={{maxWidth: '100%'}}>
            {_.map(member.messageData, (d) => (
              <Comment key={d.time}>
                <div style={{width: '40px', minHeight: '40px', float: 'left', margin: '.2em 0 0'}}>
                  <Jdenticon size='35' value={d.by}></Jdenticon>
                </div>
                <Comment.Content>
                  <Comment.Author as='a'>{d.by}</Comment.Author>
                  <Comment.Metadata>
                    <Moment
                      format='MM/DD/YYYY, hh:mm A'
                      tz='America/Los_Angeles' 
                      date={d.time}/>
                  </Comment.Metadata>
                  <Comment.Text>
                    {d.value}
                  </Comment.Text>
                </Comment.Content>
              </Comment>
            ))}
          </Comment.Group>
        </Tab.Pane>

        )},
      {menuItem: 'Raw Data', render: ()=>(
        <Table celled compact basic='very'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                Measurement Type
              </Table.HeaderCell>
              <Table.HeaderCell>
                Time of Measurement
              </Table.HeaderCell>
              <Table.HeaderCell>
                Value
              </Table.HeaderCell>
              <Table.HeaderCell>
                Unit
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(member.bodyWeightData, (d, index) => (
               <Table.Row key={'bw' + index}>
                  <Table.Cell >
                    Body Weight
                  </Table.Cell>
                  <Table.Cell> 
                    <Moment
                      format='MM/DD/YYYY, hh:mm A'
                      tz='America/Los_Angeles' 
                      date={d.time}/>
                  </Table.Cell>
                  <Table.Cell>{d.value}</Table.Cell>
                  <Table.Cell>lb</Table.Cell>
                </Table.Row>
              ))}
            {_.map(member.systolicBPData, (d, index) => (
               <Table.Row key={'bw' + index}>
                  <Table.Cell >
                    Systolic BP
                  </Table.Cell>
                  <Table.Cell> 
                    <Moment
                      format='MM/DD/YYYY, hh:mm A'
                      tz='America/Los_Angeles' 
                      date={d.time}/>
                  </Table.Cell>
                  <Table.Cell>{d.value}</Table.Cell>
                  <Table.Cell>mmHg</Table.Cell>
                </Table.Row>
              ))}
              {_.map(member.diastolicBPData, (d, index) => (
               <Table.Row key={'bw' + index}>
                  <Table.Cell >
                    Diastolic BP
                  </Table.Cell>
                  <Table.Cell> 
                    <Moment
                      format='MM/DD/YYYY, hh:mm A'
                      tz='America/Los_Angeles' 
                      date={d.time}/>
                  </Table.Cell>
                  <Table.Cell>{d.value}</Table.Cell>
                  <Table.Cell>mmHg</Table.Cell>
                </Table.Row>
              ))}           
          </Table.Body>
        </Table>
        )},
    ];

    return(
      <Modal open={this.props.open} 
              onClose={this.props.onClose}
              size='large'
              closeIcon 
              centered={false} >
        {member && (
          <ErrorBoundary>
            <Modal.Header>
              <Header image>
                <Image><Jdenticon size='120' value={member.name}></Jdenticon></Image>
                <Header.Content>
                  {member.name}
                  <Description>
                    {member.gender},&nbsp;
                    {member.age} years old                      
                  </Description>
                  <Description>
                    phone: {member.phone}                   
                  </Description>
                </Header.Content>
              </Header>
            </Modal.Header>
            <Modal.Content>
              <Card.Group>
                <Card style={{minWidth: '320px'}}>
                  <Card.Content>
                    <Card.Header content="Body Weight (in lbs)"/>
                    <LineChart
                      width={300}
                      height={150}
                      data={member.bodyWeightData}
                      margin={{
                        top: 20, right: 30, left: 0, bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey='time' tick={<CustomizedAxisTick />}/>
                      <YAxis dataKey='value' type='number' domain={['dataMin', 'dataMax']}/>
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="value" stackId="1" stroke="#ffc658" />
                    </LineChart>
                  </Card.Content>
                </Card>
                <Card style={{minWidth: '320px'}}>
                  <Card.Content>
                    <Card.Header content="Systolic BP (in mmHg)"/>
                    <LineChart
                      width={300}
                      height={150}
                      data={member.systolicBPData}
                      margin={{
                        top: 20, right: 30, left: 0, bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey='time' tick={<CustomizedAxisTick />}/>
                      <YAxis dataKey='value' type='number' domain={['dataMin', 'dataMax']}/>
                      <Tooltip content={<CustomTooltip />}/>
                      <Line type="monotone" dataKey="value" stackId="1" stroke="#82ca9d" />
                    </LineChart>
                  </Card.Content>
                </Card>
                <Card style={{minWidth: '320px'}}>
                  <Card.Content>
                    <Card.Header content="Diastolic BP (in mmHg)"/>
                    <LineChart
                      width={300}
                      height={150}
                      data={member.diastolicBPData}
                      margin={{
                        top: 20, right: 30, left: 0, bottom: 20,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey='time' tick={<CustomizedAxisTick />}/>
                      <YAxis dataKey='value' type='number' domain={['dataMin', 'dataMax']}/>
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="value" stackId="1" stroke="#8884d8" />
                    </LineChart>
                  </Card.Content>
                </Card>
              </Card.Group>
              <Divider />
              <Tab panes={panes}/>
            </Modal.Content>
          </ErrorBoundary>
        )}
      </Modal>
    )
  }
}

