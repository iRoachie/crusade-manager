import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import {
  Areas,
  Contacts,
  NewArea,
  Members,
  NewMember,
  Area,
  NewContact,
  Contact,
  Member
} from './screens';

import App from 'grommet/components/App';
import Anchor from 'grommet/components/Anchor';
import Sidebar from 'grommet/components/Sidebar';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Menu from 'grommet/components/Menu';
import Split from 'grommet/components/Split';

export default class Root extends Component {
  render() {
    return (
      <App centered={false}>
        <Router>
          <Split priority="right" flex="right">
            <Sidebar colorIndex="brand" id="sidebar">
              <Header pad="medium" justify="between">
                <Title>Crusade Manager</Title>
              </Header>
              <Box flex="grow" justify="start">
                <Menu primary={true}>
                  <Anchor path="/areas">Area Leaders</Anchor>
                  <Anchor path="/members">Members</Anchor>
                  <Anchor path="/contacts">Contacts</Anchor>
                </Menu>
              </Box>
            </Sidebar>

            <Switch>
              <Route
                exact={true}
                path="/"
                render={() => <Redirect to="/areas" />}
              />
              <Route exact path="/areas" component={Areas} />
              <Route exact path="/areas/new" component={NewArea} />
              <Route exact path="/areas/:areaRef" component={Area} />
              <Route exact path="/members" component={Members} />
              <Route exact path="/members/new" component={NewMember} />
              <Route exact path="/members/:memberRef" component={Member} />
              <Route exact path="/contacts" component={Contacts} />
              <Route exact path="/contacts/new" component={NewContact} />
              <Route exact path="/contacts/:contactRef" component={Contact} />
            </Switch>
          </Split>
        </Router>
      </App>
    );
  }
}
