import React, { useState } from 'react'
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react'
import { useStitchAuth } from "./StitchAuth";

const ErrorPage = props => {
  
  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' textAlign='center' style={{ margin: '0px' }}>
          Something went wrong. 
        </Header>
      </Grid.Column>
    </Grid>
  );
}

export default ErrorPage;