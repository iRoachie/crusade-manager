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

import { Loading } from '../../components';

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
    members: [],
    member1: null,
    member2: null,
    openingInvitation: false,
    sabbathInvitation: false,
    prayerClub: false,
    loading: false,
    toastVisible: false,
    submitting: false
  };

  componentDidMount() {
    const database = firebase.database();
    this.ref = database.ref('/members');
    this.getLeaders();
  }

  componentWillUnmount() {
    this.ref.off();
  }

  getLeaders = () => {
    this.setState({ loading: true }, () => {
      this.ref.on('value', snapshot => {
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

  addContact = e => {
    e.preventDefault();
    const { loading, submitting, toastVisible, members, ...rest } = this.state;

    if (rest.member1) {
      rest.member1 = rest.member1.value;
      rest.areaRef = this.state.members[0].areaRef;
    }

    if (rest.member2) {
      rest.member2 = rest.member2.value;
    }

    this.setState({ submitting: true }, () => {
      const database = firebase.database();
      database
        .ref('/contacts')
        .push(rest)
        .then(() => {
          this.setState({
            toastVisible: !toastVisible,
            submitting: false,
            name: '',
            house: '',
            cell: '',
            email: '',
            address: '',
            comments: '',
            openingInvitation: false,
            sabbathInvitation: false,
            prayerClub: false
          });
        });
    });
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
                      <FormField label="Team Member 1">
                        <Select
                          value={this.state.member1}
                          options={[
                            { value: null, label: 'Unassigned' },
                            ...this.state.members
                          ]}
                          onChange={({ value }) => {
                            this.setState({ member1: value });
                          }}
                        />
                      </FormField>
                    </Box>

                    <Box pad={{ vertical: 'small' }}>
                      <FormField label="Team Member 2">
                        <Select
                          value={this.state.member2}
                          options={[
                            { value: null, label: 'Unassigned' },
                            ...this.state.members
                          ]}
                          onChange={({ value }) => {
                            this.setState({ member2: value });
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
