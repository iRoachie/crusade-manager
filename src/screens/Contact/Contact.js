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
import Paragraph from 'grommet/components/Paragraph';
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
    contact: {},
    area: {},
    members: [],
    toastVisible: false,
    unsavedChanges: false
  };

  componentDidMount() {
    const { contactRef } = this.props.match.params;
    const database = firebase.database();
    this.contactRef = database.ref(`/contacts/${contactRef}`);
    this.areaRef = database.ref('/areas');
    this.membersRef = database.ref('/members');
    this.getContact();
    this.getMembers();
    window.onbeforeunload = this.unloadPage;
  }

  componentWillUnmount() {
    this.contactRef.off();
    this.areaRef.off();
    this.membersRef.off();
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

        if (contact) {
          this.setState({ contact });
          this.getArea(contact.areaRef);
        } else {
          this.setState({ loading: false, contact: null });
        }
      });
    });
  };

  getMembers = () => {
    this.setState({ loading: true }, () => {
      this.membersRef.on('value', snapshot => {
        const members = snapshot.val();

        if (members) {
          this.setState({
            members: entries(members).map(([key, member]) => ({
              value: key,
              areaRef: member.area,
              label: member.name
            })),
            loading: false
          });
        } else {
          this.setState({ loading: false });
        }
      });
    });
  };

  getArea = areaRef => {
    this.setState({ loading: true }, () => {
      this.areaRef = firebase.database().ref(`/areas/${areaRef}`);

      this.areaRef.on('value', snapshot => {
        const area = snapshot.val();

        if (area) {
          this.setState({ area, loading: false });
        } else {
          this.setState({ loading: false, area: null });
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

  saveChanges = () => {
    const { contact, members } = this.state;

    // Change areaRef for contact based on member
    if (contact.member1) {
      contact.areaRef = members.find(a => a.value === contact.member1).areaRef;
    } else {
      delete contact.areaRef;
    }

    this.setState({ loading: true }, () => {
      this.contactRef.set(contact).then(() => {
        this.setState({
          loading: false,
          toastVisible: true,
          unsavedChanges: false
        });
      });
    });
  };

  displayMember = key => this.state.members.find(a => a.value === key);

  render() {
    const { contact, area } = this.state;

    return (
      <React.Fragment>
        <Loading visible={this.state.loading} />

        {this.state.loading ? null : !contact ? (
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
                >
                  <Title>{`Contact | ${contact.name}`}</Title>
                  <Paragraph margin="none">
                    {area ? `Area Leader - ${area.leader}` : 'No Area Leader'}
                  </Paragraph>
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
                        label="Free Gift"
                        checked={contact.freeGift}
                        onChange={({ target }) =>
                          this.updateContact({ freeGift: target.checked })
                        }
                      />
                    </Box>

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
                        label="Child Enrolled"
                        checked={contact.childEnrolled}
                        onChange={({ target }) =>
                          this.updateContact({
                            childEnrolled: target.checked
                          })
                        }
                      />
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
                      <FormField label="Team Member 1">
                        <Select
                          value={this.displayMember(contact.member1)}
                          options={[
                            { value: null, label: 'Unassigned' },
                            ...this.state.members
                          ]}
                          onChange={({ value }) => {
                            this.updateContact({ member1: value.value });
                          }}
                        />
                      </FormField>
                    </Box>

                    <Box pad={{ vertical: 'small' }}>
                      <FormField label="Team Member 2">
                        <Select
                          value={this.displayMember(contact.member2)}
                          options={[
                            { value: null, label: 'Unassigned' },
                            ...this.state.members
                          ]}
                          onChange={({ value }) => {
                            this.updateContact({ member2: value.value });
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
