import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink,
  Redirect
} from 'react-router-dom';

import {
  Areas,
  Contacts,
  NewArea,
  Members,
  NewMember,
  Area,
  NewContact
} from './screens';

import App from 'grommet/components/App';
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
                  <NavLink to="/areas" activeClassName="active">
                    Areas
                  </NavLink>
                  <NavLink to="/members" activeClassName="active">
                    Members
                  </NavLink>
                  <NavLink to="/contacts" activeClassName="active">
                    Contacts
                  </NavLink>
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
              <Route exact path="/contacts" component={Contacts} />
              <Route exact path="/contacts/new" component={NewContact} />
            </Switch>
          </Split>
        </Router>
      </App>
    );
  }
}
