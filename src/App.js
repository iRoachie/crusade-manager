import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import classNames from 'classnames';

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
import Footer from 'grommet/components/Footer';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Menu from 'grommet/components/Menu';
import Button from 'grommet/components/Button';
import Archive from 'grommet/components/icons/base/Archive';
import Up from 'grommet/components/icons/base/Up';

export default class Root extends Component {
  state = {
    menuShowing: false
  };

  toggleMobileFooter = () => {
    if (window.innerWidth < 901) {
      this.setState({ menuShowing: !this.state.menuShowing });
    }
  };

  render() {
    const sidebarClasses = classNames({
      sidebar: true,
      'hide-print': true,
      'sidebar--menu-showing': this.state.menuShowing
    });

    return (
      <App centered={false}>
        <Router>
          <React.Fragment>
            <Sidebar
              colorIndex="brand"
              className={sidebarClasses}
              onClick={this.toggleMobileFooter}
            >
              <Header pad="medium" justify="between">
                <Title>Crusade Manager</Title>

                <Up className="sidebar__arrow" />
              </Header>

              <Box flex="grow" justify="start" className="sidebar__items">
                <Menu primary={true}>
                  <Anchor path="/areas">Area Leaders</Anchor>
                  <Anchor path="/contacts">Contacts</Anchor>
                  <Anchor path="/contacts-area" className="inset-menu-item">
                    > By Area
                  </Anchor>
                </Menu>
              </Box>

              <Footer pad="medium">
                <Button
                  icon={<Archive />}
                  label="Export"
                  plain
                  onClick={() =>
                    window.open(process.env.REACT_APP_DOWNLOAD_LINK)
                  }
                />
              </Footer>
            </Sidebar>

            <main className="content">
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
            </main>
          </React.Fragment>
        </Router>
      </App>
    );
  }
}
