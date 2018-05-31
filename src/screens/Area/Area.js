import React from 'react';
import firebase from 'firebase';
import entries from 'object.entries';
import { Prompt } from 'react-router-dom';

import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Heading from 'grommet/components/Heading';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Section from 'grommet/components/Section';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Toast from 'grommet/components/Toast';

import { Empty, Loading, Alert, ContactCard } from '../../components';

export default class Area extends React.Component {
  state = {
    loading: false,
    area: {},
    contacts: [],
    submitting: false,
    toastVisible: false,
    unsavedChanges: false
  };

  componentDidMount() {
    const { areaRef } = this.props.match.params;
    const database = firebase.database();
    this.areaRef = database.ref(`/areas/${areaRef}`);
    this.contactRef = database.ref('/contacts');
    this.getArea();
    window.onbeforeunload = this.unloadPage;
  }

  componentWillUnmount() {
    this.areaRef.off();
    this.contactRef.off();
  }

  unloadPage = () => {
    if (this.state.unsavedChanges) {
      return 'You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?';
    }
  };

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

  saveArea = e => {
    e.preventDefault();

    const { area } = this.state;

    this.setState({ submitting: true }, () => {
      this.areaRef.set(area).then(() => {
        this.setState({
          submitting: false,
          toastVisible: true,
          unsavedChanges: false
        });
      });
    });
  };

  updateArea = data => {
    const { area } = this.state;
    this.setState({
      area: {
        ...area,
        ...data
      },
      unsavedChanges: true
    });
  };

  render() {
    const { area, loading, submitting } = this.state;

    return (
      <React.Fragment>
        <Loading visible={loading || submitting} />

        {loading ? null : !area ? (
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
            <form onSubmit={this.saveArea}>
              <Header fixed float={false} direction="column" align="stretch">
                <Box flex direction="row" justify="between">
                  <Box
                    flex={true}
                    pad={{ horizontal: 'medium', vertical: 'small' }}
                    justify="center"
                  >
                    <Title>{`Area Leader | ${area.leader}`}</Title>
                  </Box>

                  <Box direction="row">
                    <Box pad={{ horizontal: 'small', vertical: 'small' }}>
                      <Button type="submit" label="Save Changes" />
                    </Box>
                  </Box>
                </Box>
              </Header>

              <Alert
                visible={this.state.unsavedChanges}
                message="You have unsaved changes."
              />

              <Section pad={{ horizontal: 'medium', vertical: 'medium' }}>
                <Heading tag="h3">Leader Details</Heading>

                <Box pad={{ vertical: 'small' }}>
                  <Box direction="row" justify="start">
                    <div style={{ width: '480px', maxWidth: '100%' }}>
                      <FormFields>
                        <Box pad={{ vertical: 'small' }}>
                          <FormField label="Leader Name">
                            <TextInput
                              value={area.leader}
                              autoComplete="off"
                              required
                              onDOMChange={({ target }) =>
                                this.updateArea({ leader: target.value })
                              }
                            />
                          </FormField>
                        </Box>

                        <Box pad={{ vertical: 'small' }}>
                          <FormField label="Area Address">
                            <textarea
                              value={area.address}
                              autoComplete="off"
                              rows={5}
                              onChange={({ target }) =>
                                this.updateArea({ address: target.value })
                              }
                            />
                          </FormField>
                        </Box>
                      </FormFields>
                    </div>

                    <div
                      style={{
                        width: '480px',
                        maxWidth: '100%',
                        marginLeft: 60
                      }}
                    >
                      <FormFields>
                        <Box pad={{ vertical: 'small' }}>
                          <FormField label="Leader House Number">
                            <TextInput
                              autoComplete="off"
                              type="tel"
                              value={area.house}
                              onDOMChange={({ target }) =>
                                this.updateArea({ house: target.value })
                              }
                            />
                          </FormField>
                        </Box>

                        <Box pad={{ vertical: 'small' }}>
                          <FormField label="Leader Cell Number">
                            <TextInput
                              value={area.cell}
                              type="tel"
                              autoComplete="off"
                              onDOMChange={({ target }) =>
                                this.updateArea({ cell: target.value })
                              }
                            />
                          </FormField>
                        </Box>

                        <Box pad={{ vertical: 'small' }}>
                          <FormField label="Leader Email Address">
                            <TextInput
                              autoComplete="off"
                              type="email"
                              value={area.email}
                              onDOMChange={({ target }) =>
                                this.updateArea({ email: target.value })
                              }
                            />
                          </FormField>
                        </Box>
                      </FormFields>
                    </div>
                  </Box>
                </Box>
              </Section>
            </form>

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

        {this.state.toastVisible && (
          <Toast
            status="ok"
            duration={2000}
            onClose={() => this.setState({ toastVisible: false })}
          >
            Area Leader Updated.
          </Toast>
        )}

        <Prompt
          when={this.state.unsavedChanges}
          message={location => `Are you sure you want to close without saving?`}
        />
      </React.Fragment>
    );
  }
}
