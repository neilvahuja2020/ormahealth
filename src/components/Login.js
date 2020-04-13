import React, { useState } from 'react'
import { Button, Form, Grid, Header, Image, Segment, Message } from 'semantic-ui-react'
import { useStitchAuth } from "./StitchAuth";
import { 
  useHistory
} from "react-router-dom";


const LoginForm = props => {
  
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

    actions.handleEmailPasswordLogin(email, password)
      .then(
        () => {history.replace({pathname: '/'});}
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
          Log-in to your account
        </p>
        <Form size='large' error={formError}>
          <Segment stacked>
            <Message
              error
              header='Invalid Username or Password'
              content='Please check your username/password again.'
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
              Log-in
            </Button>
          </Segment>
        </Form>
        <p style={{ marginTop: '10px' }}>
          Forgot your password? <a href='/passwordresetsend'>Reset your password.</a>
        </p>
        
      </Grid.Column>
    </Grid>
  );
}

export default LoginForm;