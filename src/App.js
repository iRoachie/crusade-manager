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
  Area,
  NewContact,
  Contact,
  ContactsByArea
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
            <Sidebar colorIndex="brand" className="hide-print" id="sidebar">
              <Header pad="medium" justify="between">
                <Title>Crusade Manager</Title>
              </Header>
              <Box flex="grow" justify="start">
                <Menu primary={true}>
                  <Anchor path="/areas">Area Leaders</Anchor>
                  <Anchor path="/contacts">Contacts</Anchor>
                  <Anchor path="/contacts-area" className="inset-menu-item">
                    > By Area
                  </Anchor>
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
              <Route exact path="/contacts" component={Contacts} />
              <Route exact path="/contacts-area" component={ContactsByArea} />
              <Route exact path="/contacts/new" component={NewContact} />
              <Route exact path="/contacts/:contactRef" component={Contact} />
            </Switch>
          </Split>
        </Router>
      </App>
    );
  }
}
