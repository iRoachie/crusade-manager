import React from 'react';
import entries from 'object.entries';

import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Heading from 'grommet/components/Heading';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import Footer from 'grommet/components/Footer';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Toast from 'grommet/components/Toast';
import Select from 'grommet/components/Select';
import Spinning from 'grommet/components/icons/Spinning';
import CheckBox from 'grommet/components/CheckBox';

import { Alert, Loading } from '../../components';
import { formatFirebaseArray } from '../../utils';

import firebase from 'firebase';

export default class NewContact extends React.Component {
  state = {
    name: '',
    age: '',
    address: '',
    house: '',
    cell: '',
    email: '',
    comments: '',
    areaLeaders: [],
    areaLeader: null,
    tracts: [],
    openingInvitation: false,
    sabbathInvitation: false,
    prayerClub: false,
    loading: false,
    toastVisible: false,
    submitting: false,
    contacts: [],
    showDuplicate: false
  };

  componentDidMount() {
    const database = firebase.database();
    this.ref = database.ref('/areas');
    this.contactsRef = database.ref('/contacts');
    this.getLeaders();
    this.getContacts();
  }

  componentWillUnmount() {
    this.ref.off();
    this.contactsRef.off();
  }

  getContacts = () => {
    this.setState({ loading: true }, () => {
      this.contactsRef.on('value', snapshot => {
        const contacts = snapshot.val();

        if (contacts) {
          this.setState({
            contacts: formatFirebaseArray(contacts),
            loading: false
          });
        } else {
          this.setState({ loading: false });
        }
      });
    });
  };

  getLeaders = () => {
    this.setState({ loading: true }, () => {
      this.ref.on('value', snapshot => {
        const areas = snapshot.val();

        if (areas) {
          this.setState({
            areaLeaders: entries(areas).map(([key, area]) => ({
              value: key,
              label: area.leader
            })),
            loading: false
          });
        } else {
          this.setState({ loading: false });
        }
      });
    });
  };

  isUnique = () => {
    return (
      this.state.contacts.filter(
        a => a.name.toLowerCase() === this.state.name.toLowerCase()
      ).length === 0
    );
  };

  addContact = e => {
    e.preventDefault();

    if (!this.isUnique()) {
      this.setState({ showDuplicate: true }, () => {
        setTimeout(() => {
          this.setState({ showDuplicate: false });
        }, 2000);
      });
      return;
    }

    const {
      loading,
      submitting,
      toastVisible,
      areaLeaders,
      areaLeader,
      contacts,
      showDuplicate,
      ...contact
    } = this.state;

    if (areaLeader) {
      contact.areaRef = areaLeader.value;
    }

    this.setState({ submitting: true }, () => {
      const database = firebase.database();
      database
        .ref('/contacts')
        .push(contact)
        .then(() => {
          this.setState({
            toastVisible: !toastVisible,
            submitting: false,
            name: '',
            house: '',
            cell: '',
            email: '',
            address: '',
            tracts: [],
            comments: '',
            openingInvitation: false,
            sabbathInvitation: false,
            prayerClub: false
          });
        });
    });
  };

  toggleTract = number => {
    const { tracts } = this.state;

    if (tracts.includes(number)) {
      this.setState({ tracts: tracts.filter(a => a !== number) });
    } else {
      this.setState({ tracts: [...tracts, number] });
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.state.toastVisible && (
          <Toast
            status="ok"
            duration={2000}
            onClose={() => this.setState({ toastVisible: false })}
          >
            Contact Added.
          </Toast>
        )}

        <Article>
          <Header fixed float={false} pad={{ horizontal: 'medium' }}>
            <Title>New Contact</Title>
          </Header>

          <Alert
            visible={this.state.showDuplicate}
            message="Duplicate Contact Name"
          />

          <Loading visible={this.state.loading} />

          {this.state.loading ? null : (
            <Box pad={{ horizontal: 'medium', vertical: 'medium' }}>
              <Form
                onSubmit={this.addContact}
                disabled={this.state.submitting}
                style={{ width: '100%' }}
              >
                <Box direction="row" justify="start">
                  <div style={{ width: '480px', maxWidth: '100%' }}>
                    <Heading tag="h3">Contact Info</Heading>

                    <FormFields>
                      <Box pad={{ vertical: 'small' }}>
                        <FormField label="Name">
                          <TextInput
                            value={this.state.name}
                            autoComplete="off"
                            required
                            onDOMChange={e =>
                              this.setState({ name: e.target.value })
                            }
                          />
                        </FormField>
                      </Box>

                      <Box pad={{ vertical: 'small' }}>
                        <FormField label="Age">
                          <Select
                            value={this.state.age}
                            options={['Under 12', '12-15', '16-21', 'Over 21']}
                            onChange={({ value }) => {
                              this.setState({ age: value });
                            }}
                          />
                        </FormField>
                      </Box>

                      <Box pad={{ vertical: 'small' }}>
                        <FormField label="Address">
                          <textarea
                            value={this.state.address}
                            autoComplete="off"
                            rows={5}
                            onChange={e =>
                              this.setState({ address: e.target.value })
                            }
                          />
                        </FormField>
                      </Box>

                      <Box direction="row">
                        <Box pad={{ vertical: 'small' }}>
                          <FormField label="House Number">
                            <TextInput
                              autoComplete="off"
                              type="tel"
                              value={this.state.house}
                              onDOMChange={e =>
                                this.setState({ house: e.target.value })
                              }
                            />
                          </FormField>
                        </Box>

                        <Box pad={{ vertical: 'small' }}>
                          <FormField label="Cell Number">
                            <TextInput
                              value={this.state.cell}
                              type="tel"
                              autoComplete="off"
                              onDOMChange={e =>
                                this.setState({ cell: e.target.value })
                              }
                            />
                          </FormField>
                        </Box>
                      </Box>

                      <Box pad={{ vertical: 'small' }}>
                        <FormField label="Email Address">
                          <TextInput
                            autoComplete="off"
                            type="email"
                            value={this.state.email}
                            onDOMChange={e =>
                              this.setState({ email: e.target.value })
                            }
                          />
                        </FormField>
                      </Box>
                    </FormFields>

                    <Footer pad={{ vertical: 'medium' }}>
                      <Button
                        label={this.state.submitting ? <Spinning /> : 'Submit'}
                        type="submit"
                        primary={true}
                      />
                    </Footer>
                  </div>

                  <div
                    style={{ width: '480px', maxWidth: '100%', marginLeft: 60 }}
                  >
                    <Heading tag="h3">Crusade Info</Heading>

                    <Box pad={{ vertical: 'small' }}>
                      <CheckBox
                        label="Opening Invitation"
                        checked={this.state.openingInvitation}
                        onChange={() => {
                          this.setState({
                            openingInvitation: !this.state.openingInvitation
                          });
                        }}
                      />
                    </Box>

                    <Box pad={{ vertical: 'small' }}>
                      <CheckBox
                        label="Sabbath Invitation"
                        checked={this.state.sabbathInvitation}
                        onChange={() => {
                          this.setState({
                            sabbathInvitation: !this.state.sabbathInvitation
                          });
                        }}
                      />
                    </Box>

                    <Box pad={{ vertical: 'small' }}>
                      <CheckBox
                        label="Prayer Club"
                        checked={this.state.prayerClub}
                        onChange={() => {
                          this.setState({
                            prayerClub: !this.state.prayerClub
                          });
                        }}
                      />
                    </Box>

                    <Box pad={{ vertical: 'medium' }}>
                      <Heading tag="h4" strong>
                        Tracts
                      </Heading>
                      <Box>
                        <Box direction="row">
                          <Box pad={{ vertical: 'small' }}>
                            <CheckBox
                              label="1"
                              checked={this.state.tracts.includes(1)}
                              onChange={() => {
                                this.toggleTract(1);
                              }}
                            />
                          </Box>
                          <Box pad={{ vertical: 'small' }}>
                            <CheckBox
                              label="2"
                              checked={this.state.tracts.includes(2)}
                              onChange={() => {
                                this.toggleTract(2);
                              }}
                            />
                          </Box>
                          <Box pad={{ vertical: 'small' }}>
                            <CheckBox
                              label="3"
                              checked={this.state.tracts.includes(3)}
                              onChange={() => {
                                this.toggleTract(3);
                              }}
                            />
                          </Box>
                          <Box pad={{ vertical: 'small' }}>
                            <CheckBox
                              label="4"
                              checked={this.state.tracts.includes(4)}
                              onChange={() => {
                                this.toggleTract(4);
                              }}
                            />
                          </Box>
                        </Box>

                        <Box direction="row">
                          <Box pad={{ vertical: 'small' }}>
                            <CheckBox
                              label="5"
                              checked={this.state.tracts.includes(5)}
                              onChange={() => {
                                this.toggleTract(5);
                              }}
                            />
                          </Box>

                          <Box pad={{ vertical: 'small' }}>
                            <CheckBox
                              label="6"
                              checked={this.state.tracts.includes(6)}
                              onChange={() => {
                                this.toggleTract(6);
                              }}
                            />
                          </Box>
                          <Box pad={{ vertical: 'small' }}>
                            <CheckBox
                              label="7"
                              checked={this.state.tracts.includes(7)}
                              onChange={() => {
                                this.toggleTract(7);
                              }}
                            />
                          </Box>
                          <Box pad={{ vertical: 'small' }}>
                            <CheckBox
                              label="8"
                              checked={this.state.tracts.includes(8)}
                              onChange={() => {
                                this.toggleTract(8);
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    <Box pad={{ vertical: 'medium' }}>
                      <FormField label="Comments">
                        <textarea
                          value={this.state.comments}
                          autoComplete="off"
                          rows={5}
                          onChange={e =>
                            this.setState({ comments: e.target.value })
                          }
                        />
                      </FormField>
                    </Box>

                    <Box pad={{ vertical: 'small' }}>
                      <FormField label="Area Leader">
                        <Select
                          value={this.state.areaLeader}
                          options={[
                            { value: null, label: 'Unassigned' },
                            ...this.state.areaLeaders
                          ]}
                          onChange={({ value }) => {
                            this.setState({ areaLeader: value });
                          }}
                        />
                      </FormField>
                    </Box>
                  </div>
                </Box>
              </Form>
            </Box>
          )}
        </Article>
      </React.Fragment>
    );
  }
}
