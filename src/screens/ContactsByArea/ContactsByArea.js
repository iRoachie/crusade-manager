import React from 'react';
import firebase from 'firebase';
import entries from 'object.entries';

import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import CheckBox from 'grommet/components/CheckBox';

import { Empty, Loading, ContactCard } from '../../components';
import { groupBy, formatFirebaseArray } from '../../utils';

export default class ContactsByArea extends React.Component {
  state = {
    status: 0,
    areas: [],
    contacts: [],
    filteredContacts: [],
    openingInvitation: false,
    sabbathInvitation: false,
    prayerClub: false
  };

  componentDidMount() {
    const database = firebase.database();
    this.contactsRef = database.ref('/contacts');
    this.areasRef = database.ref('/areas');

    this.getAreas();
    this.getContacts();
  }

  shouldComponentUpdate(_, nextState) {
    return nextState !== this.state;
  }

  componentWillUnmount() {
    this.contactsRef.off();
    this.areasRef.off();
  }

  componentDidUpdate(_, prevState) {
    if (this.state.status === 2 && prevState.status === 1) {
      this.filterList();
    }
  }

  getAreas = () => {
    this.areasRef.on('value', snapshot => {
      const areas = snapshot.val();

      if (areas) {
        this.setState({
          areas: formatFirebaseArray(areas),
          status: this.state.status + 1
        });
      } else {
        this.setState({
          status: this.state.status + 1
        });
      }
    });
  };

  getContacts = () => {
    this.contactsRef.on('value', snapshot => {
      const contacts = snapshot.val();

      if (contacts) {
        this.setState({
          contacts: formatFirebaseArray(contacts),
          status: this.state.status + 1
        });
      } else {
        this.setState({
          status: this.state.status + 1
        });
      }
    });
  };

  filterList = () => {
    const { contacts } = this.state;

    const filteredContacts = contacts
      .filter(a => (this.state.sabbathInvitation ? a.sabbathInvitation : a))
      .filter(a => (this.state.prayerClub ? a.prayerClub : a))
      .filter(a => (this.state.openingInvitation ? a.openingInvitation : a));

    const grouped = groupBy(filteredContacts, 'areaRef');

    this.setState({ filteredContacts: entries(grouped) });
  };

  getAreaLeader = areaRef => {
    if (!areaRef || areaRef === 'undefined') {
      return 'NO AREA LEADER';
    }

    return this.state.areas.find(a => a.key === areaRef).leader;
  };

  render() {
    const { status, filteredContacts: contacts } = this.state;

    return (
      <Article>
        <Header
          fixed
          float={false}
          pad={{ horizontal: 'medium', vertical: 'small' }}
          direction="column"
          align="stretch"
        >
          <Box flex direction="row" justify="between" className="header-inner">
            <Title>Contacts by Area</Title>
          </Box>

          <Box flex direction="row" className="hide-print">
            <Box pad={{ vertical: 'small' }}>
              <CheckBox
                label="Opening Invitation"
                checked={this.state.openingInvitation}
                onChange={({ target }) =>
                  this.setState(
                    {
                      openingInvitation: target.checked
                    },
                    this.filterList
                  )
                }
              />
            </Box>

            <Box pad={{ vertical: 'small' }}>
              <CheckBox
                label="Sabbath Invitation"
                checked={this.state.sabbathInvitation}
                onChange={({ target }) =>
                  this.setState(
                    {
                      sabbathInvitation: target.checked
                    },
                    this.filterList
                  )
                }
              />
            </Box>

            <Box pad={{ vertical: 'small' }}>
              <CheckBox
                label="Prayer Club"
                checked={this.state.prayerClub}
                onChange={({ target }) =>
                  this.setState(
                    {
                      prayerClub: target.checked
                    },
                    this.filterList
                  )
                }
              />
            </Box>
          </Box>
        </Header>

        <Loading visible={status !== 2} />

        {status === 2 &&
          this.state.contacts.length === [] &&
          contacts.length === 0 && <Empty message="No Contacts Added" />}

        {status === 2 &&
          contacts.length > 0 && (
            <Box
              pad={{ horizontal: 'medium', vertical: 'medium' }}
              flex={true}
              wrap={true}
            >
              {contacts.reverse().map(([key, list]) => (
                <Box key={key} pad={{ vertical: 'small' }}>
                  <Title className="group-title">
                    {this.getAreaLeader(key)}
                  </Title>

                  <Box flex direction="row" wrap align="start">
                    {list.map(contact => (
                      <ContactCard
                        contact={contact}
                        key={contact.key}
                        path={contact.key}
                        showAreaLeader={false}
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
      </Article>
    );
  }
}
