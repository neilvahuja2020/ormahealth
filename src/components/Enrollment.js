import React, { useState } from 'react'
import { Grid, Image, Form, Modal, Header, Message } from 'semantic-ui-react'
import ErrorBoundary from 'react-error-boundary';
import Jdenticon from 'react-jdenticon';
import { users, members, twilio } from "../stitch";


export default function Enrollment(props) {

  const [memberName, setMemberName] = useState({firstName: '', 
                                                lastName: ''});
  const [gender, setGender] = useState('male');
  const [bt004, setBt004] = useState(false);
  const [bt105, setBt105] = useState(false);  
  const [dob, setDOB] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState({address1: '', 
                                      address2: '',
                                      city: '',
                                      state: '',
                                      zipCode: ''});
  const [note, setNote] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [formError, setFormError] = useState(false);
  
  const handleNameChange = (event) => {
    const {name, value} = event.target;
    let nameObj = {firstName: memberName.firstName,
                  lastName: memberName.lastName}
    nameObj[name] = value;
    setMemberName(nameObj);
  }

  const handleGenderChange = (event, {value}) => {
    setGender(value)
  }

  const handleNoteChange = (event) => {
    const {value} = event.target;
    setNote(value);
  }

  const handleEmailChange = (event) => {
    const {value} = event.target;
    setEmail(value);
  }

  const handleDOBChange = (event) => {
    const {value} = event.target;
    let newValue = '';
    if (dob.length > value.length){ // delete operation
      setDOB(value);
    } else if(!isNaN(value[value.length-1])) {
      newValue = value.substring(0,2);
      if (newValue.length === 2) { newValue += '/'; }
      if (value.length > 3){ newValue += value.substring(3,5); }
      if (newValue.length === 5) { newValue += '/'; }
      if (value.length > 6){ newValue += value.substring(6,10); }
      setDOB(newValue);
    }
  }

  const handlePhoneNumberChange = (event) => {
    const {value} = event.target;
    let newValue = '';
    if (phoneNumber.length > value.length){ // delete operation
      setPhoneNumber(value);
    } else if(!isNaN(value[value.length-1])) {
      newValue = value.substring(0,3);
      if (newValue.length === 3) { newValue += '-'; }
      if (value.length > 4){ newValue += value.substring(4,7); }
      if (newValue.length === 7) { newValue += '-'; }
      if (value.length > 8){ newValue += value.substring(8,12); }
      setPhoneNumber(newValue);
    }
  }

  const handleAddressChange = (event) => {
    const {name, value} = event.target;
    let addressObj = {address1: address.address1,
                  address2: address.address2,
                  city: address.city,
                  state: address.state,
                  zipCode: address.zipCode};
    addressObj[name] = value;
    setAddress(addressObj);  
  }

  const handleSubmit = (event) => {
    var timestamp = Date.parse(dob);

    if (memberName.firstName==='' ||
      memberName.lastName==='' ||
      !(bt004 || bt105) ||
      isNaN(timestamp) ||
      phoneNumber==='' ||
      email==='' ||
      address.address1==='' ||
      address.city==='' ||
      address.state==='' ||
      address.zipCode===''){
      setFormError(true);
    }else{
      let devices = [];
      if (bt004) { devices.push('BT004'); }
      if (bt105) { devices.push('BT105'); }
      const firstNote = ('Hi ' + memberName.firstName + ' ' + memberName.lastName + ', ' +
                        'congrats on enrolling into the RPM program. ' + 
                        'We are Orma Health, and we will soon send the devices ('+ devices.toString() + 
                        ') to your home address. ' + 
                        'If the address below is different from your home address, ' + 
                        'please reply to this text message with the correct address. Otherwise, no action is required.: ' +
                        '[ADDRESS] ' + address.address1 + ' ' + address.address2 + ' ' + 
                        address.city + ', ' + address.state + ' ' + address.zipCode);
      
      const member = {name: memberName.firstName + ' ' + memberName.lastName,
                  email: email,
                  phone: '+1' + phoneNumber.replace(/-/g, ''),
                  dob: new Date(dob).toISOString(),
                  owner_id: props.currentUserGroup, // owner ID
                  gender: gender,
                  address: address,
                  noteData: [],
                  messageData: [{
                    time: new Date().toISOString(),
                    value: firstNote,
                    by: props.currentUserName,
                    email: props.currentUserEmail
                  }],
                  bodyWeightData: [],
                  systolicBPData: [],
                  diastolicBPData: [],
                  additionalInfo: note,
                  devices: devices};

      members.insertOne(member)
      .then(result => {
        setEnrolled(true);
        twilio.sendMessage('+1' + phoneNumber.replace(/-/g, ''), "+14807251429", firstNote)
          .catch(err => console.error(`Failed to send a message: ${err}`));
      })
      .catch(err => console.error(`Failed to find document: ${err}`));
    } 
  }

  const refreshState = (event) => {
    setEnrolled(false);
    setMemberName({firstName: '', lastName: ''});
    setBt004(false);
    setBt105(false);
    setDOB('');
    setGender('male');
    setPhoneNumber('');
    setEmail('');
    setAddress({address1: '', 
                address2: '',
                city: '',
                state: '',
                zipCode: ''});
    setNote('');
    setConfirm(false);
    setFormError(false);
  }

  return (
  	<ErrorBoundary>
      <Grid textAlign='center' >
        <Grid.Column  width={3}>
          <Image>
            <Jdenticon size='200' value={memberName.firstName + ' ' + memberName.lastName}/>
          </Image>
        </Grid.Column>
        <Grid.Column  width={6} textAlign='left' verticalAlign='middle'>
          <Form>
            <Form.Input fluid 
              name='firstName' label='First name' placeholder='First name' 
              value={memberName.firstName} 
              onChange={handleNameChange} />
            <Form.Input fluid 
              name='lastName' label='Last name' placeholder='Last name' 
              value={memberName.lastName}  
              onChange={handleNameChange} />     
          </Form>
        </Grid.Column>
        <Grid.Column width={9} textAlign='left'>
          <Form error={formError} >
            <Form.Group inline>
              <label>Gender</label>
              <Form.Radio
                label='Male'
                value='male'
                checked={gender==='male'}
                onChange={handleGenderChange}
              />
              <Form.Radio
                label='Female'
                value='female'       
                checked={gender==='female'}
                onChange={handleGenderChange}
              />
              <Form.Radio
                label='Other'
                value='other'       
                checked={gender==='other'}
                onChange={handleGenderChange}
              />
            </Form.Group>
            <Form.Group inline>
              <label>Devices</label>
              <Form.Checkbox
                label='Weight Scale (BT004)'
                value='ws'
                checked={bt004===true}
                onChange={()=>{return bt004?setBt004(false):setBt004(true)}}
              />
              <Form.Checkbox
                label='Blood Pressure (BT105)'
                value='bp'       
                checked={bt105===true}
                onChange={()=>{return bt105?setBt105(false):setBt105(true)}}
              />
            </Form.Group>
            <Form.Input fluid name="dob" label='Date of Birth' 
                placeholder='MM/DD/YYYY' 
                value={dob} 
                onChange={handleDOBChange}/>
            <Form.Input fluid name="phoneNumber" label='Phone Number' 
                placeholder='000-000-0000' 
                value={phoneNumber} 
                onChange={handlePhoneNumberChange} />
            <Form.Input fluid name="email" label='Email' 
                placeholder='john.doe@gmail.com' 
                value={email} 
                onChange={handleEmailChange} />

            <Form.Input fluid name='address1' label='Address 1' 
                placeholder='Street Address'
                value={address.address1}
                onChange={handleAddressChange} />
            <Form.Input fluid name='address2' label='Address 2' 
                placeholder='Apartment, Building, Floor, etc.' 
                value={address.address2}
                onChange={handleAddressChange} />
            <Form.Input fluid name='city' label='City' 
                placeholder='City'
                value={address.city}
                onChange={handleAddressChange} />
            <Form.Group widths='equal'>
              <Form.Input fluid name='state' label='State' 
                placeholder='State'
                value={address.state}
                onChange={handleAddressChange} />
              <Form.Input fluid name='zipCode' label='Zip/Postal Code' 
                placeholder='00000'
                value={address.zipCode}
                onChange={handleAddressChange} />
            </Form.Group>
            <Form.TextArea name='note'
              label='Note' placeholder='Tell us more about the member...'
              value={note}
              onChange={handleNoteChange} />
            <Form.Checkbox 
            label='I (physician) confirm that the member is consulted and consented about the RPM devices.' 
            checked={confirm}
            onChange={()=>{return confirm?setConfirm(false):setConfirm(true)}}/>
            <Message
              error
              header='Missing Information'
              content='Please check if you missed filling out any form e.g. email, phone number, etc.'
            />
            <Form.Button primary disabled={!confirm} onClick={handleSubmit}>
              Enroll the member and send RPM devices
            </Form.Button>
          </Form>
          <Modal open={enrolled}
            onClose={refreshState}
            closeIcon>
            <Modal.Header>Congrats on your New Enrollment!</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Header>{memberName.firstName + ' ' + memberName.lastName} is enrolled.</Header>
                <p> 
                  We will send a text message to the member that his/her enrollment is completed. 
                  The devices will be sent to the member in the next 24 hours.
                  It will take from 3 to 5 days for the member to receive the devices.
                </p>
                <p>
                  A new member profile is created on the dashboard page. 
                  You will see new measurements on the dashboard as soon as the member starts to use the devices.
                </p>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        </Grid.Column>
      </Grid>
    </ErrorBoundary>
  );
}