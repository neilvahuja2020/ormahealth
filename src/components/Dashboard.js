import React, { Component } from 'react'
import { Header } from 'semantic-ui-react'
import DataTable from './DataTable'
import QuickStats from './QuickStats'
import ErrorBoundary from "react-error-boundary";
import { loadMembers } from './useMembers'


export default class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.handleMemberDataChange = this.handleMemberDataChange.bind(this);
    this.state = {
      members: null,
      counts: null,
      stats: null, 
    };
  }

  componentDidMount() {
    loadMembers()
      .then(data => (this.setState({members: data.members, 
                                counts: data.counts,
                                stats: data.stats})));
  }

  handleMemberDataChange(newMembers) {
    this.setState({members: newMembers});
  }

  render() {
    return (
    	<ErrorBoundary>
        <Header as='h3' dividing>
          <Header.Content>Quick Stats</Header.Content>
          <Header.Subheader>Summary statistics of RPM activities</Header.Subheader>
        </Header>
        <QuickStats stats={this.state.stats} counts={this.state.counts}></QuickStats>
    	  <Header as='h3' dividing>
          <Header.Content>Member Details</Header.Content>
          <Header.Subheader>Click a column header to sort-by-date of the corresponding measurements, and click a member to view more details.</Header.Subheader>
    	  </Header>
        <DataTable
          currentUserName={this.props.currentUserName}
          currentUserEmail={this.props.currentUserEmail} 
          members={this.state.members} 
          onMemberDataChange={this.handleMemberDataChange}>
        </DataTable>
    	</ErrorBoundary>
    )
  }
}