import React from 'react';
import firebase from 'firebase';
import entries from 'object.entries';

import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Paragraph from 'grommet/components/Paragraph';
import Section from 'grommet/components/Section';

import { Empty, Loading, PersonCard, ContactCard } from '../../components';

export default class Area extends React.Component {
  state = {
    loading: false,
    area: {},
    contacts: []
  };

  componentDidMount() {
    const { areaRef } = this.props.match.params;
    const database = firebase.database();
    this.areaRef = database.ref(`/areas/${areaRef}`);
    this.contactRef = database.ref('/contacts');
    this.getArea();
  }

  componentWillUnmount() {
    this.areaRef.off();
    this.contactRef.off();
  }

  getArea = () => {
    this.setState({ loading: true }, () => {
      this.areaRef.on('value', snapshot => {
        const area = snapshot.val();

        if (area) {
          this.getContacts(snapshot.key);
          this.setState({ area });
        } else {
          this.setState({ loading: false, area: null });
        }
      });
    });
  };

  getContacts = areaRef => {
    this.contactRef
      .orderByChild('areaRef')
      .equalTo(areaRef)
      .on('value', snapshot => {
        const contacts = snapshot.val();

        if (contacts) {
          this.setState({ contacts: entries(contacts), loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
  };

  getAreaLeader = ({ areaRef }) =>
    areaRef && this.state.areas.find(a => a[0] === areaRef)[1].leader;

  render() {
    const { area } = this.state;

    return (
      <React.Fragment>
        <Loading visible={this.state.loading} />

        {this.state.loading ? null : !area ? (
          <Empty
            message="Area Leader Not Found"
            large
            render={
              <Box pad={{ vertical: 'small' }}>
                <Button label="Back to Area Leaders" path="/areas" />
              </Box>
            }
          />
        ) : (
          <Article>
            <Header fixed float={false} pad={{ horizontal: 'medium' }}>
              <Box flex={true}>
                <Title>{`Area Leader | ${area.leader}`}</Title>
                <Paragraph margin="none">{area.address}</Paragraph>
              </Box>
            </Header>

            <Section pad={{ horizontal: 'medium', vertical: 'medium' }}>
              <Heading tag="h3">Leader Details</Heading>

              <PersonCard
                person={{
                  house: area.house,
                  cell: area.cell,
                  email: area.email
                }}
              />
            </Section>

            <Section
              pad={{ horizontal: 'medium', vertical: 'medium' }}
              className="arealeader-contacts"
            >
              <Heading tag="h3">
                Contacts ({this.state.contacts.length})
              </Heading>

              <Box
                pad={{ vertical: 'medium' }}
                flex={true}
                direction="row"
                wrap={true}
              >
                {this.state.contacts.map(([key, contact]) => (
                  <ContactCard
                    key={key}
                    showAreaLeader={false}
                    path={key}
                    contact={contact}
                    areaLeader={this.getAreaLeader}
                  />
                ))}
              </Box>
            </Section>
          </Article>
        )}
      </React.Fragment>
    );
  }
}
