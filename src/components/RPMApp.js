import React, { useState, useEffect } from "react";
import ErrorBoundary from "react-error-boundary";
import Dashboard from './Dashboard';
import Registry from './Registry';
import Enrollment from './Enrollment';
import Settings from './Settings';
import { useStitchAuth } from "./StitchAuth";
import { Container, Menu, Image, Dropdown } from 'semantic-ui-react';
import Jdenticon from 'react-jdenticon';
import { users } from "../stitch";


export default function RPMApp() {
  
  const { currentUser, actions} = useStitchAuth();

  const [ currentUserName, setCurrentUserName ] = useState('');
  const [ currentUserGroup, setCurrentUserGroup ] = useState('');

  const [ menu, setMenu ] = useState("dashboard")

  const handleMenuChange = (event, { name }) => {
    setMenu(name);
  }

  useEffect(() => {
    users.findOne({id: currentUser.id}).then(customData => {
      if(customData){
        setCurrentUserName(customData.name);
        setCurrentUserGroup(customData.group_id);
      }
    }).catch(
      err => (console.error(`Failed to retrieve the user: ${err}`))
    );
  }, []);

  return (
    <ErrorBoundary>
      <Menu borderless size='large' fixed='top'>
        <Container>
          <Menu.Item as='a' header>
            <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em'}} />
            Orma
          </Menu.Item>
          <Menu.Item
            name='dashboard'
            active={menu === 'dashboard'}
            content='Dashboard'
            onClick={handleMenuChange}
          />
          <Menu.Item
            name='registry'
            active={menu === 'registry'}
            content='Registry'
            onClick={handleMenuChange}
          />
          <Menu.Item
            name='enrollment'
            active={menu === 'enrollment'}
            content='Enrollment'
            onClick={handleMenuChange}
          />
               
          <Menu.Item position='right'> 
            <Dropdown item pointing='top left' 
              trigger={<span><Image avatar>{currentUserName ? <Jdenticon size='40' value={currentUserName}/>: null}</Image>{currentUserName}</span>}>
              <Dropdown.Menu>
                <Dropdown.Item 
                  onClick={handleMenuChange}>
                  Settings
                </Dropdown.Item>
                <Dropdown.Item disabled>Resources</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item 
                  onClick={actions.handleLogout}>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Container>
      </Menu>
      <Container style={{ marginTop: '8em' }}>
      {(menu === 'dashboard')?
        <Dashboard 
          currentUserEmail={currentUser.profile.email} 
          currentUserName={currentUserName}/> :
        ((menu === 'enrollment')?
          <Enrollment 
            currentUserEmail={currentUser.profile.email} 
            currentUserName={currentUserName}
            currentUserGroup={currentUserGroup} />:
          ((menu === 'registry')?
            <Registry 
              currentUserEmail={currentUser.profile.email} 
              currentUserName={currentUserName} />:
            <Settings 
              currentUserEmail={currentUser.profile.email} 
              currentUserName={currentUserName} />))}
      </Container>
    </ErrorBoundary>
  );
}



