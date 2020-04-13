import _ from 'lodash';
import React, { Component } from 'react';
import { Table, 
  Header, 
  Image, 
  Loader, 
  Segment, 
  Dimmer, 
  Label,
  Icon,
} from 'semantic-ui-react';
import { Sparklines, 
  SparklinesLine, 
  SparklinesSpots, 
} from 'react-sparklines';
import styled from '@emotion/styled';
import ErrorBoundary from "react-error-boundary";
import MemberModal from './MemberModal';
import Moment from 'react-moment';
import 'moment-timezone';
import Jdenticon from 'react-jdenticon';

const RedFont = styled.span`
  color: red;
  font-size: 0.7em;
`
const GreenFont = styled.span`
  color: green;
  font-size: 0.7em;
`
const Description = styled.div`
  color: grey;
  font-size: 0.7em;
  font-weight: normal;
  line-height: normal
` 

function DTCell(props){
  if (props.value) {
    return (
        <Table.Cell textAlign='center'>
          <Header as='h4'>
            <Header.Content>
              {props.value} {props.unit} &nbsp;
              {props.valueDiff > 0 ? 
                <RedFont> +{props.valueDiff} <i className='fas fa-arrow-up'></i></RedFont>:
                <GreenFont> {props.valueDiff} <i className='fas fa-arrow-down'></i></GreenFont>}
              <Description>
                <Moment
                  format='MM/DD/YYYY, hh:mm A'
                  tz='America/Los_Angeles' 
                  date={props.lastDT}/>
              </Description>
              <Sparklines data={props.SLData} svgWidth={100} svgHeight={25} margin={5} >
                <SparklinesLine color={props.valueDiff > 0? 'red':'green'}/>
                <SparklinesSpots size={2} />
              </Sparklines>
            </Header.Content>
          </Header>
        </Table.Cell>
      )
  } else {
    return (
      <Table.Cell textAlign='center'><div style={{color: 'grey'}}>-</div></Table.Cell>
    )

  }
  
}


export default class DataTable extends Component {

  constructor(props) {
    super(props);
    this.handleMemberDataChange = this.handleMemberDataChange.bind(this);

    this.state = {
      columnSorted: 'latestNoteDT',
      direction: 'descending',
      selectedMemberEmail: null,
      selectedMemberPhone: null,
      selectedMemberIdx: -1,
      modalOpen: false,
    }
  }

  handleSort = (clickedColumn) => () => {
    const { columnSorted, direction } = this.state;
    let members = this.props.members;

    if (columnSorted !== clickedColumn) {
      this.setState({
        columnSorted: clickedColumn,
        direction: 'descending',
      });

      this.props.onMemberDataChange(_.sortBy(members, [clickedColumn]).reverse());
      return
    }

    this.setState({
      //data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
    this.props.onMemberDataChange(members.reverse());
  }

  handleRowClick = ({phone, email}) => () => {
    const memberIdx = _.findIndex(this.props.members, x => x.phone===phone);
    this.setState({modalOpen: true, 
                  selectedMemberEmail: email,
                  selectedMemberPhone: phone,
                  selectedMemberIdx: memberIdx});

    return
  }

  closeModal = () => this.setState({modalOpen: false, 
                                    selectedMemberEmail: null,
                                    selectedMemberPhone: null})

  handleMemberDataChange(newmembers){
    this.props.onMemberDataChange(newmembers);
  }

  render() {
    
    const { columnSorted, direction, modalOpen, 
        selectedMemberEmail, selectedMemberPhone, selectedMemberIdx } = this.state;
    const members = this.props.members;


    if (!members){ 
      return(
        <Segment>
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>

          <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
        </Segment>
      ) 
    } else{
      return (
        <ErrorBoundary>
          <Table sortable celled selectable compact basic='very'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={4}
                  sorted={columnSorted === 'name' ? direction : null}
                  onClick={this.handleSort('name')}
                >
                  Name
                </Table.HeaderCell>
                <Table.HeaderCell width={3} textAlign='center'
                  sorted={columnSorted === 'latestNoteDT' ? direction : null}
                  onClick={this.handleSort('latestNoteDT')}
                >
                  Last Session
                </Table.HeaderCell>
                <Table.HeaderCell width={3} textAlign='center'
                  sorted={columnSorted === 'bodyWeightLastDT' ? direction : null}
                  onClick={this.handleSort('bodyWeightLastDT')}
                >
                  Body Weight
                </Table.HeaderCell>
                <Table.HeaderCell width={3} textAlign='center'
                  sorted={columnSorted === 'systolicBPLastDT' ? direction : null}
                  onClick={this.handleSort('systolicBPLastDT')}
                >
                  Systolic BP
                </Table.HeaderCell>
                <Table.HeaderCell width={3} textAlign='center'
                  sorted={columnSorted === 'diastolicBPLastDT' ? direction : null}
                  onClick={this.handleSort('diastolicBPLastDT')}
                >
                  Diastolic BP
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {_.map(members, (d, index) => (
                <Table.Row key={d.phone + "::" + d.email} 
                  onClick={this.handleRowClick({phone: d.phone, email: d.email})}>
                  <Table.Cell >
                    <Header as='h4' image>
                      <Image><Jdenticon size='80' value={d.name}></Jdenticon></Image>
                      <Header.Content>
                        {d.name}
                        <Description>
                          {d.gender},&nbsp;
                          {d.age} years old,&nbsp;
                          {d.phone}                      
                        </Description>
                        <Description>
                          {d.numUnreadMessages > 0 && <Label size='mini' style={{margin: '0.2rem 0.5rem 0 0'}}>
                            <Icon name='mail' /> {d.numUnreadMessages}
                          </Label>}
                          {d.hypertensionAlert && <Label size='mini' color='red' style={{margin: '0.2rem 0.5rem 0 0'}}>
                            High BP
                          </Label>}
                          {d.hypotensionAlert && <Label size='mini' color='violet' style={{margin: '0.2rem 0.5rem 0 0'}}>
                            Low BP
                          </Label>}
                        </Description>
                      </Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell textAlign='center'>
                    {d.latestNote && 
                      <Moment
                        format='MM/DD/YYYY, hh:mm A'
                        tz='America/Los_Angeles' 
                        date={d.latestNoteDT}/>}
                    <Description>{d.latestNote ? (d.latestNote.length > 75? d.latestNote.substring(0,75)+'...' : d.latestNote) : ''}</Description>
                  </Table.Cell>
                  <DTCell value={d.bodyWeight} unit='lbs' valueDiff={d.bodyWeightDiff} SLData={d.bodyWeightSLData} lastDT={d.bodyWeightLastDT}/>
                  <DTCell value={d.systolicBP} unit='mmHg' valueDiff={d.systolicBPDiff} SLData={d.systolicBPSLData} lastDT={d.systolicBPLastDT}/>                
                  <DTCell value={d.diastolicBP} unit='mmHg' valueDiff={d.diastolicBPDiff} SLData={d.diastolicBPSLData} lastDT={d.diastolicBPLastDT}/>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <MemberModal 
              open={modalOpen} 
              onClose={this.closeModal} 
              members={members} 
              selectedMemberEmail={selectedMemberEmail} 
              selectedMemberPhone={selectedMemberPhone}
              selectedMemberIdx={selectedMemberIdx}
              onMemberDataChange={this.handleMemberDataChange}
              currentUserName={this.props.currentUserName}
              currentUserEmail={this.props.currentUserEmail} />
        </ErrorBoundary>
      )
    }
  }
}