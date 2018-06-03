import React from 'react';
import firebase from 'firebase';
import entries from 'object.entries';

import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Search from 'grommet/components/Search';
import Button from 'grommet/components/Button';
import CheckBox from 'grommet/components/CheckBox';

import { Empty, Loading, ContactCard } from '../../components';

export default class Contacts extends React.Component {
  state = {
    search: '',
    status: 'initial',
    areas: [],
    contacts: [],
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

  componentWillUnmount() {
    this.contactsRef.off();
    this.areasRef.off();
  }

  getAreas = () => {
    this.setState({ status: 'loading' }, () => {
      this.areasRef.on('value', snapshot => {
        const areas = snapshot.val();

        if (areas) {
          this.setState({ areas: entries(areas), status: 'loaded' });
        } else {
          this.setState({ status: 'loaded' });
        }
      });
    });
  };

  getContacts = () => {
    this.setState({ status: 'loading' }, () => {
      this.contactsRef.on('value', snapshot => {
        const contacts = snapshot.val();

        if (contacts) {
          this.setState({ contacts: entries(contacts), status: 'loaded' });
        } else {
          this.setState({ status: 'loaded' });
        }
      });
    });
  };

  filterList = () => {
    const { contacts, search } = this.state;

    return contacts
      .filter(
        ([_, contact]) =>
          search
            ? contact.name.toLowerCase().includes(search.toLowerCase())
            : contact
      )
      .filter(
        ([_, a]) => (this.state.sabbathInvitation ? a.sabbathInvitation : a)
      )
      .filter(([_, a]) => (this.state.prayerClub ? a.prayerClub : a))
      .filter(
        ([_, a]) => (this.state.openingInvitation ? a.openingInvitation : a)
      );
  };

  getAreaLeader = ({ areaRef }) =>
    areaRef && this.state.areas.find(a => a[0] === areaRef)[1].leader;

  render() {
    const contacts = this.filterList();
    const { status } = this.state;

    return (
      <Article>
        <Header
          fixed
          float={false}
          pad={{ horizontal: 'medium' }}
          direction="column"
          align="stretch"
        >
          <Box flex direction="row" justify="between" className="header-inner">
            <Box direction="row" justify="between" flex={true} align="center">
              <Title>
                Contacts
                <span style={{ marginLeft: -8 }}>
                  {status === 'loaded' && `(${this.state.contacts.length})`}
                </span>
              </Title>

              <Box
                flex={true}
                justify="end"
                direction="row"
                responsive={true}
                className="hide-print"
              >
                <Search
                  inline={true}
                  fill={true}
                  size="medium"
                  placeHolder="Search"
                  dropAlign={{ right: 'right' }}
                  value={this.state.search}
                  onDOMChange={e => this.setState({ search: e.target.value })}
                />
              </Box>
            </Box>

            <Box
              pad={{ horizontal: 'small', vertical: 'small' }}
              justify="center"
              className="hide-print"
            >
              <Button label="New Contact" path="contacts/new" />
            </Box>
          </Box>

          <Box flex direction="row" className="hide-print">
            <Box pad={{ vertical: 'small' }}>
              <CheckBox
                label="Opening Invitation"
                checked={this.state.openingInvitation}
                onChange={({ target }) =>
                  this.setState({
                    openingInvitation: target.checked
                  })
                }
              />
            </Box>

            <Box pad={{ vertical: 'small' }}>
              <CheckBox
                label="Sabbath Invitation"
                checked={this.state.sabbathInvitation}
                onChange={({ target }) =>
                  this.setState({
                    sabbathInvitation: target.checked
                  })
                }
              />
            </Box>

            <Box pad={{ vertical: 'small' }}>
              <CheckBox
                label="Prayer Club"
                checked={this.state.prayerClub}
                onChange={({ target }) =>
                  this.setState({
                    prayerClub: target.checked
                  })
                }
              />
            </Box>
          </Box>
        </Header>

        <Loading visible={status === 'loading'} />

        {status === 'loaded' &&
          this.state.contacts.length === [] &&
          contacts.length === 0 && <Empty message="No Contacts Added" />}

        {status === 'loaded' &&
          this.state.contacts.length > 0 &&
          contacts.length === 0 && (
            <Empty message="No Contacts found for that search" />
          )}

        {status === 'loaded' &&
          contacts.length > 0 && (
            <Box
              pad={{ horizontal: 'medium', vertical: 'medium' }}
              flex={true}
              direction="row"
              wrap={true}
            >
              {contacts.map(([key, contact]) => (
                <ContactCard
                  contact={contact}
                  key={key}
                  path={key}
                  areaLeader={this.getAreaLeader(contact)}
                />
              ))}
            </Box>
          )}
      </Article>
    );
  }
}
