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

import { Loading, PersonCard } from '../../components';

export default class Area extends React.Component {
  state = {
    loading: false,
    area: {},
    members: []
  };

  componentDidMount() {
    const { areaRef } = this.props.match.params;
    const database = firebase.database();
    this.areaRef = database.ref(`/areas/${areaRef}`);
    this.membersRef = database.ref('/members');
    this.getArea();
  }

  getArea = () => {
    this.setState({ loading: true }, () => {
      this.areaRef.on('value', snapshot => {
        const area = snapshot.val();

        if (area) {
          this.getMembers(snapshot.key);
          this.setState({ area });
        } else {
          this.setState({ loading: false, area: null });
        }
      });
    });
  };

  getMembers = areaRef => {
    this.membersRef
      .orderByChild('area')
      .equalTo(areaRef)
      .on('value', snapshot => {
        const members = snapshot.val();

        if (members) {
          this.setState({ members: entries(members), loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
  };

  componentWillUnmount() {
    this.areaRef.off();
    this.membersRef.off();
  }

  render() {
    const { area } = this.state;

    return (
      <React.Fragment>
        <Loading visible={this.state.loading} />

        {this.state.loading ? null : !area ? (
          <Box flex={true} pad={{ vertical: 'medium' }} align="center">
            <Heading tag="h3">Area Not Found</Heading>

            <Box pad={{ vertical: 'small' }}>
              <Button label="Back to Areas" path="/areas" />
            </Box>
          </Box>
        ) : (
          <Article>
            <Header fixed float={false} pad={{ horizontal: 'medium' }}>
              <Box flex={true}>
                <Title>{`${area.leader}'s Area`}</Title>
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

            <Section pad={{ horizontal: 'medium', vertical: 'medium' }}>
              <Heading tag="h3">Members ({this.state.members.length})</Heading>

              <Box
                pad={{ vertical: 'medium' }}
                flex={true}
                direction="row"
                wrap={true}
              >
                {this.state.members.map(([key, member]) => (
                  <PersonCard key={key} person={member} />
                ))}
              </Box>
            </Section>
          </Article>
        )}
      </React.Fragment>
    );
  }
}
