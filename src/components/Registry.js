import React, { Component } from 'react'
import { Table } from 'semantic-ui-react'
import { registry } from "../stitch";
import _ from 'lodash';
import Moment from 'react-moment';
import 'moment-timezone';


export default class Registry extends Component {

  constructor(props) {
    super(props);
    this.state = {data: null,
                columnSorted: 'lastUsed',
                direction: 'descending'};
  }

  handleSort = (clickedColumn) => () => {
    const { data, columnSorted, direction } = this.state;

    if (columnSorted !== clickedColumn) {
      this.setState({
        data: _.sortBy(data, [clickedColumn]).reverse(),
        columnSorted: clickedColumn,
        direction: 'descending',
      });
      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  }


  componentDidMount() {
    const { columnSorted } = this.state;

    registry.find({}).asArray()
      .then(data => (this.setState({data: _.sortBy(data, [columnSorted]).reverse()})));
  }

  render() {

    const { columnSorted, direction } = this.state;


    return (
      <Table sortable celled compact basic='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={columnSorted === 'imei' ? direction : null}
              onClick={this.handleSort('imei')}> 
              IMEI 
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={columnSorted === 'name' ? direction : null}
              onClick={this.handleSort('name')}> 
              Member Name 
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={columnSorted === 'phone' ? direction : null}
              onClick={this.handleSort('phone')}> 
              Phone Number 
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={columnSorted === 'device' ? direction : null}
              onClick={this.handleSort('device')}> 
              Device Type 
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={columnSorted === 'startDate' ? direction : null}
              onClick={this.handleSort('startDate')}> 
              Start Date 
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={columnSorted === 'lastUsed' ? direction : null}
              onClick={this.handleSort('lastUsed')}> 
              Last Used 
            </Table.HeaderCell>            
            <Table.HeaderCell
              sorted={columnSorted === 'signalStrength' ? direction : null}
              onClick={this.handleSort('signalStrength')}> 
              Signal Strength 
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={columnSorted === 'batteryVoltage' ? direction : null}
              onClick={this.handleSort('batteryVoltage')}> 
              Battery Strength 
            </Table.HeaderCell>            
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(this.state.data, (d) => (
            <Table.Row key={d.imei}>
              <Table.Cell >
                {d.imei}
              </Table.Cell>
              <Table.Cell >
                {d.name}
              </Table.Cell>
              <Table.Cell >
                {d.phone}
              </Table.Cell>
              <Table.Cell >
                {d.device}
              </Table.Cell>
              <Table.Cell >
                <Moment
                  format='MM/DD/YYYY, hh:mm A'
                  tz='America/Los_Angeles' 
                  date={d.startDate}/>
              </Table.Cell>                
              <Table.Cell >
                <Moment
                  format='MM/DD/YYYY, hh:mm A'
                  tz='America/Los_Angeles' 
                  date={d.lastUsed}/>
              </Table.Cell>                            
              <Table.Cell>
                {d.signalStrength>50?
                  <span style={{color:'rgb(62,141,202)'}}>{d.signalStrength+'%'}</span>:
                  <span style={{color:'rgb(221,79,64)'}}>{d.signalStrength+'%'}</span>}
              </Table.Cell>
              <Table.Cell >
                {d.batteryVoltage>4000?
                  <span style={{color:'rgb(62,141,202)'}}>{d.batteryVoltage+'mV'}</span>:
                  <span style={{color:'rgb(221,79,64)'}}>{d.batteryVoltage+'mV'}</span>}
              </Table.Cell>              
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      )
  }

}