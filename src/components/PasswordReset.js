import React, { useState } from 'react'
import { Button, Form, Grid, Header, Image, Segment, Message } from 'semantic-ui-react'
import { useStitchAuth } from "./StitchAuth";
import { useLocation, useHistory } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PasswordResetForm = props => {

  const [password, setPassword] = useState("");

  const [formError, setFormError] = useState(false);

  const { actions } = useStitchAuth();

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  }
  
  let query = useQuery();
  let token = query.get('token');
  let tokenId = query.get('tokenId');
  let history = useHistory();

  const handleSubmit = event => {

    actions.handleResetPassword(token, tokenId, password)
      .then(
        () => {history.replace({pathname: '/login'});}
      )
      .catch(
        () => { setFormError(true); }
      );
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' textAlign='center' style={{ margin: '0px' }}>
          <Image src='/logo.png' />
        </Header>
        <p>
          Reset Your Password
        </p>
        <Form size='large' error={formError}>
          <Segment stacked>
            <Message
              error
              header='Invalid Password'
              content='Password should have at least 6 characters.'
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='New Password'
              type='password'
              onChange={handlePasswordChange}
            />
            <Button 
              basic
              fluid size='large' 
              onClick={handleSubmit}>
              Change Password
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default PasswordResetForm;