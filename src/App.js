import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink,
  Redirect
} from 'react-router-dom';

import {
  AreaLeaders,
  Contacts,
  NewAreaLeader,
  Members,
  NewTeamMember
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
          <Split priority="left" flex="right">
            <Sidebar colorIndex="brand">
              <Header pad="medium" justify="between">
                <Title>Crusade Manager</Title>
              </Header>
              <Box flex="grow" justify="start">
                <Menu primary={true}>
                  <NavLink to="/leaders" activeClassName="active">
                    Area Leaders
                  </NavLink>
                  <NavLink to="/members" activeClassName="active">
                    Team Members
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
                render={() => <Redirect to="/leaders" />}
              />
              <Route exact path="/leaders" component={AreaLeaders} />
              <Route exact path="/leaders/new" component={NewAreaLeader} />
              <Route exact path="/members" component={Members} />
              <Route exact path="/members/new" component={NewTeamMember} />
              <Route path="/contacts" component={Contacts} />
            </Switch>
          </Split>
        </Router>
      </App>
    );
  }
}
