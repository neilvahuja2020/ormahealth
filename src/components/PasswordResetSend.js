import React, { useState } from 'react'
import { Button, Form, Grid, Header, Image, Segment, Message } from 'semantic-ui-react'
import { useStitchAuth } from "./StitchAuth";

const PasswordResetForm = props => {

  const [email, setEmail] = useState("");

  const [formSuccess, setFormSuccess] = useState(false);

  const { actions } = useStitchAuth();

  const handleEmailChange = event => {
    setEmail(event.target.value);
  }

  const handleSubmit = event => {
    actions.handleResetPasswordSend(email).then(
      () => { setFormSuccess(true); }
    ).catch(
      () => { console.log('something went wrong...'); }
    )
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' textAlign='center' style={{ margin: '0px' }}>
          <Image src='/logo.png' />
          Orma
        </Header>
        <Form size='large' success={formSuccess}>
          <Segment stacked>
            <Message
              success
              header='Successfully sent a Reset-Password Email'
              content='Check your emails and follow the link provided'
            />
            <Form.Input 
              fluid icon='user' 
              iconPosition='left' 
              placeholder='E-mail address'
              onChange={handleEmailChange}
            />
            <Button 
              basic
              fluid size='large' 
              onClick={handleSubmit}>
              Send a Reset-Password Email
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
}

export default PasswordResetForm;