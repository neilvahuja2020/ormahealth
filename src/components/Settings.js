import React from 'react'
import { Grid, Form } from 'semantic-ui-react'
import ErrorBoundary from 'react-error-boundary';

export default function Settings() {
	return (
    <ErrorBoundary>
      <Grid textAlign='center' >
        <Grid.Column width={9} textAlign='left'>
          <Form>
            <Form.Group inline>
              <label>Default Screen</label>
              <Form.Radio
                label='Dashboard'
                value=''
                defaultChecked
                disabled
              />
              <Form.Radio
                label='Enrollment'
                value=''  
                disabled     
              />
              <Form.Radio
                label='Settings'
                value=''
                disabled
              />
            </Form.Group>
            <Form.Group inline>
              <label>Text Reminder Settings</label>
              <Form.Radio
                label='No Reminder'
                value=''
                disabled
              />
              <Form.Radio
                label='If 2 Days Missing'
                value=''
                defaultChecked
                disabled       
              />
              <Form.Radio
                label='If 3 Days Missing'
                value=''
                disabled
              />
            </Form.Group>
            <Form.TextArea 
              label='Text Message Template' 
              placeholder='Hi {member}, did you forget your weight measurement today?' />

            <Form.Group inline>
              <label>Time Line Visualization</label>
              <Form.Radio
                label='Impute values'
                value=''
                disabled
              />
              <Form.Radio
                label='No impute'
                value=''
                defaultChecked       
                disabled
              />
            </Form.Group>

            <Form.Group inline>
              <label>Default Sort Option</label>
              <Form.Radio
                label='Latest Note Time'
                value=''
                defaultChecked
                disabled
              />
              <Form.Radio
                label='Weight High to Low'
                value=''
                disabled       
              />
              <Form.Radio
                label='Weight Low to High'
                value=''  
                disabled     
              />              
            </Form.Group>            
          </Form>
        </Grid.Column>
      </Grid>
    </ErrorBoundary>

  );
}