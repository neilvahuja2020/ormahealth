import React, { useState } from 'react'
import { Button, Form, Grid, Header, Image, Segment, Message } from 'semantic-ui-react'
import { useStitchAuth } from "./StitchAuth";
import { 
  useHistory
} from "react-router-dom";


const SignupForm = props => {
  
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [formError, setFormError] = useState(false);

  const { actions } = useStitchAuth();

  const handleEmailChange = event => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  }

  let history = useHistory();

  const handleSubmit = event => {
    
    actions.handleSignup(email, password)
      .then(
        () => { history.replace({pathname: '/login'}); }
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
          Create your account!
        </p>
        <Form size='large' error={formError}>
          <Segment stacked>
            <Message
              error
              header='Invalid Username or Password'
              content='Please use a valid email address and password at least 6 characters long.'
            />
            <Form.Input 
              fluid icon='user' 
              iconPosition='left' 
              placeholder='E-mail address'
              onChange={handleEmailChange}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              onChange={handlePasswordChange}
            />
            <Button 
              basic
              fluid size='large' 
              onClick={handleSubmit}>
              Sign Up
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default SignupForm;