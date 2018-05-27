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
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Select from 'grommet/components/Select';
import CheckBox from 'grommet/components/CheckBox';
import Toast from 'grommet/components/Toast';

import { Alert, Empty, Loading } from '../../components';

export default class Contact extends React.Component {
  state = {
    loading: false,
    submitting: false,
    contact: null,
    areaLeaders: [],
    toastVisible: false,
    unsavedChanges: false
  };

  componentDidMount() {
    const { contactRef } = this.props.match.params;
    const database = firebase.database();
    this.contactRef = database.ref(`/contacts/${contactRef}`);
    this.areasRef = database.ref('/areas');
    this.getContact();
    this.getAreas();
    window.onbeforeunload = this.unloadPage;
  }

  componentWillUnmount() {
    this.contactRef.off();
    this.areasRef.off();
  }

  unloadPage = () => {
    if (this.state.unsavedChanges) {
      return 'You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?';
    }
  };

  getContact = () => {
    this.setState({ loading: true }, () => {
      this.contactRef.on('value', snapshot => {
        const contact = snapshot.val();

        if (contact.tracts) {
          contact.tracts = Object.values(contact.tracts);
        } else {
          contact.tracts = [];
        }

        if (contact) {
          this.setState({ contact });
        } else {
          this.setState({ loading: false, contact: null });
        }
      });
    });
  };

  getAreas = () => {
    this.setState({ loading: true }, () => {
      this.areasRef.on('value', snapshot => {
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

  updateContact = data => {
    const { contact } = this.state;
    this.setState({
      contact: {
        ...contact,
        ...data
      },
      unsavedChanges: true
    });
  };

  toggleTract = number => {
    const { contact } = this.state;
    let { tracts } = contact;

    if (tracts.includes(number)) {
      tracts = tracts.filter(a => a !== number);
    } else {
      tracts = [...tracts, number];
    }

    this.setState({
      contact: {
        ...contact,
        tracts
      }
    });
  };

  saveChanges = () => {
    const { contact } = this.state;

    this.setState({ submitting: true }, () => {
      this.contactRef.set(contact).then(() => {
        this.setState({
          submitting: false,
          toastVisible: true,
          unsavedChanges: false
        });
      });
    });
  };

  displayAreaLeader = key => this.state.areaLeaders.find(a => a.value === key);

  render() {
    const { contact, loading, submitting } = this.state;

    return (
      <React.Fragment>
        <Loading visible={loading || submitting} />

        {loading ? null : !contact ? (
          <Empty
            message="Contact Not Found"
            large
            render={
              <Box pad={{ vertical: 'small' }}>
                <Button label="Back to Contacts" path="/contacts" />
              </Box>
            }
          />
        ) : (
          <Article>
            <Header fixed float={false} direction="column" align="stretch">
              <Box flex direction="row" justify="between">
                <Box
                  flex={true}
                  pad={{ horizontal: 'medium', vertical: 'small' }}
                  justify="center"
                >
                  <Title>{`Contact | ${contact.name}`}</Title>
                </Box>

                <Box pad={{ horizontal: 'small', vertical: 'small' }}>
                  <Button label="Save Changes" onClick={this.saveChanges} />
                </Box>
              </Box>
            </Header>

            <Alert
              visible={this.state.unsavedChanges}
              message="You have unsaved changes."
            />

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
                            value={contact.name}
                            autoComplete="off"
                            required
                            onDOMChange={({ target }) =>
                              this.updateContact({
                                name: target.value
                              })
                            }
                          />
                        </FormField>
                      </Box>

                      <Box pad={{ vertical: 'small' }}>
                        <FormField label="Age">
                          <Select
                            value={contact.age}
                            options={['Under 12', '12-15', '16-21', 'Over 21']}
                            onChange={({ value }) => {
                              this.updateContact({
                                age: value
                              });
                            }}
                          />
                        </FormField>
                      </Box>

                      <Box pad={{ vertical: 'small' }}>
                        <FormField label="Address">
                          <textarea
                            value={contact.address}
                            autoComplete="off"
                            rows={5}
                            onChange={({ target }) =>
                              this.updateContact({
                                address: target.value
                              })
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
                              value={contact.house}
                              onDOMChange={({ target }) =>
                                this.updateContact({
                                  house: target.value
                                })
                              }
                            />
                          </FormField>
                        </Box>

                        <Box pad={{ vertical: 'small' }}>
                          <FormField label="Cell Number">
                            <TextInput
                              value={contact.cell}
                              type="tel"
                              autoComplete="off"
                              onDOMChange={({ target }) =>
                                this.updateContact({
                                  cell: target.value
                                })
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
                            value={contact.email}
                            onDOMChange={({ target }) =>
                              this.updateContact({
                                email: target.value
                              })
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
                    <Heading tag="h3">Crusade Info</Heading>

                    <Box pad={{ vertical: 'small' }}>
                      <CheckBox
                        label="Opening Invitation"
                        checked={contact.openingInvitation}
                        onChange={({ target }) =>
                          this.updateContact({
                            openingInvitation: target.checked
                          })
                        }
                      />
                    </Box>

                    <Box pad={{ vertical: 'small' }}>
                      <CheckBox
                        label="Sabbath Invitation"
                        checked={contact.sabbathInvitation}
                        onChange={({ target }) =>
                          this.updateContact({
                            sabbathInvitation: target.checked
                          })
                        }
                      />
                    </Box>

                    <Box pad={{ vertical: 'small' }}>
                      <CheckBox
                        label="Prayer Club"
                        checked={contact.prayerClub}
                        onChange={({ target }) =>
                          this.updateContact({
                            prayerClub: target.checked
                          })
                        }
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
                              checked={contact.tracts.includes(1)}
                              onChange={() => {
                                this.toggleTract(1);
                              }}
                            />
                          </Box>
                          <Box pad={{ vertical: 'small' }}>
                            <CheckBox
                              label="2"
                              checked={contact.tracts.includes(2)}
                              onChange={() => {
                                this.toggleTract(2);
                              }}
                            />
                          </Box>
                          <Box pad={{ vertical: 'small' }}>
                            <CheckBox
                              label="3"
                              checked={contact.tracts.includes(3)}
                              onChange={() => {
                                this.toggleTract(3);
                              }}
                            />
                          </Box>
                          <Box pad={{ vertical: 'small' }}>
                            <CheckBox
                              label="4"
                              checked={contact.tracts.includes(4)}
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
                              checked={contact.tracts.includes(5)}
                              onChange={() => {
                                this.toggleTract(5);
                              }}
                            />
                          </Box>

                          <Box pad={{ vertical: 'small' }}>
                            <CheckBox
                              label="6"
                              checked={contact.tracts.includes(6)}
                              onChange={() => {
                                this.toggleTract(6);
                              }}
                            />
                          </Box>
                          <Box pad={{ vertical: 'small' }}>
                            <CheckBox
                              label="7"
                              checked={contact.tracts.includes(7)}
                              onChange={() => {
                                this.toggleTract(7);
                              }}
                            />
                          </Box>
                          <Box pad={{ vertical: 'small' }}>
                            <CheckBox
                              label="8"
                              checked={contact.tracts.includes(8)}
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
                          value={contact.comments}
                          autoComplete="off"
                          rows={5}
                          onChange={({ target }) =>
                            this.updateContact({ comments: target.value })
                          }
                        />
                      </FormField>
                    </Box>

                    <Box pad={{ vertical: 'small' }}>
                      <FormField label="Area Leader">
                        <Select
                          value={this.displayAreaLeader(contact.areaRef)}
                          options={[
                            { value: null, label: 'Unassigned' },
                            ...this.state.areaLeaders
                          ]}
                          onChange={({ value }) => {
                            this.updateContact({ areaRef: value.value });
                          }}
                        />
                      </FormField>
                    </Box>
                  </div>
                </Box>
              </Form>
            </Box>
          </Article>
        )}

        {this.state.toastVisible && (
          <Toast
            status="ok"
            duration={2000}
            onClose={() => this.setState({ toastVisible: false })}
          >
            Contact Updated.
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
