import React from 'react';
import firebase from 'firebase';
import entries from 'object.entries';

import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Search from 'grommet/components/Search';
import Button from 'grommet/components/Button';
import Label from 'grommet/components/Label';
import Paragraph from 'grommet/components/Paragraph';
import CheckBox from 'grommet/components/CheckBox';

import { Empty, Loading } from '../../components';

export default class Contacts extends React.Component {
  state = {
    search: '',
    status: 'initial',
    members: null,
    areas: [],
    contacts: [],
    openingInvitation: false,
    sabbathInvitation: false
  };

  componentDidMount() {
    const database = firebase.database();
    this.contactsRef = database.ref('/contacts');
    this.areasRef = database.ref('/areas');
    this.membersRef = database.ref('/members');
    this.getAreas();
    this.getContacts();
    this.getMembers();
  }

  componentWillUnmount() {
    this.contactsRef.off();
    this.areasRef.off();
    this.membersRef.off();
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

  getMembers = () => {
    this.setState({ status: 'loading' }, () => {
      this.membersRef.on('value', snapshot => {
        const members = snapshot.val();

        if (members) {
          this.setState({ members: entries(members), status: 'loaded' });
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
      .filter(
        ([_, a]) => (this.state.openingInvitation ? a.openingInvitation : a)
      );
  };

  getAreaLeader = contact => {
    if (contact.member1) {
      const memberRef = contact.member1;
      const areaRef = this.state.members.find(a => a[0] === memberRef)[1].area;

      if (areaRef) {
        return this.state.areas.find(a => a[0] === areaRef)[1].leader;
      }
    }

    return 'NO AREA LEADER';
  };

  render() {
    const contacts = this.filterList();
    const { status, members } = this.state;

    return (
      <Article>
        <Header
          fixed
          float={false}
          pad={{ horizontal: 'medium' }}
          direction="column"
          align="stretch"
        >
          <Box flex direction="row" justify="between" style={{ height: 72 }}>
            <Box direction="row" justify="between" flex={true} align="center">
              <Title>Contacts</Title>

              <Box flex={true} justify="end" direction="row" responsive={true}>
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
            >
              <Button label="New Contact" path="contacts/new" />
            </Box>
          </Box>

          <Box
            flex
            direction="row"
            pad={{ horizontal: 'medium' }}
            justify="center"
          >
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
          contacts.length > 0 &&
          members && (
            <Box
              pad={{ horizontal: 'medium', vertical: 'medium' }}
              flex={true}
              direction="row"
              wrap={true}
            >
              {contacts.map(([key, contact]) => (
                <Box
                  key={key}
                  pad={{ horizontal: 'small', vertical: 'small' }}
                  colorIndex="light-2"
                  className="arealeader-box"
                >
                  <Box
                    justify="between"
                    flex={true}
                    direction="row"
                    responsive={false}
                  >
                    <Title>{contact.name}</Title>
                    <Button
                      label="View"
                      path={`contacts/${key}`}
                      primary
                      style={{
                        padding: '0 4px',
                        minWidth: 0,
                        marginRight: 2
                      }}
                    />
                  </Box>

                  <Box pad={{ vertical: 'small' }}>
                    <Paragraph className="arealeader-box__label" margin="none">
                      Area Leader
                    </Paragraph>
                    <Label margin="none">{this.getAreaLeader(contact)}</Label>
                  </Box>

                  <Box pad={{ vertical: 'small' }}>
                    <Paragraph className="arealeader-box__label" margin="none">
                      House Phone
                    </Paragraph>
                    <Label margin="none">{contact.house}</Label>
                  </Box>

                  <Box pad={{ vertical: 'small' }}>
                    <Paragraph className="arealeader-box__label" margin="none">
                      Cell Phone
                    </Paragraph>
                    <Label margin="none">{contact.cell}</Label>
                  </Box>

                  <Box pad={{ vertical: 'small' }}>
                    <Paragraph className="arealeader-box__label" margin="none">
                      Email
                    </Paragraph>
                    <Label margin="none">{contact.email}</Label>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
      </Article>
    );
  }
}
