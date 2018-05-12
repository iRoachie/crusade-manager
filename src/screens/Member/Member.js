import React from 'react';
import entries from 'object.entries';
import { Prompt } from 'react-router-dom';

import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Paragraph from 'grommet/components/Paragraph';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Toast from 'grommet/components/Toast';
import Select from 'grommet/components/Select';

import { Alert, Loading, Empty } from '../../components';

import firebase from 'firebase';

export default class Member extends React.Component {
  state = {
    member: {},
    leaders: null,
    loading: false,
    toastVisible: false,
    submitting: false,
    unsavedChanges: false
  };

  componentDidMount() {
    const { memberRef } = this.props.match.params;
    const database = firebase.database();
    this.memberRef = database.ref(`/members/${memberRef}`);
    this.leadersRef = database.ref(`/areas`);
    this.getMember();
    this.getLeaders();
    window.onbeforeunload = this.unloadPage;
  }

  componentWillUnmount() {
    this.memberRef.off();
    this.leadersRef.off();
  }

  unloadPage = () => {
    if (this.state.unsavedChanges) {
      return 'You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?';
    }
  };

  getMember = () => {
    this.setState({ loading: true }, () => {
      this.memberRef.on('value', snapshot => {
        const member = snapshot.val();
        this.setState({ member: member, loading: false });
      });
    });
  };

  getLeaders = () => {
    this.setState({ loading: true }, () => {
      this.leadersRef.on('value', snapshot => {
        const leaders = snapshot.val();

        if (leaders) {
          this.setState({
            leaders: entries(leaders).map(([key, leader]) => ({
              value: key,
              label: leader.leader
            })),
            loading: false
          });
        } else {
          this.setState({ loading: false });
        }
      });
    });
  };

  getAreaLeader = () => {
    const area = this.state.leaders.find(
      a => a.key === this.state.member.areaRef
    );

    return area ? `Area Leader - ${area.label}` : 'No Area Leader';
  };

  saveChanges = () => {
    const { member } = this.state;

    this.setState({ loading: true }, () => {
      this.memberRef.set(member).then(() => {
        this.setState({
          loading: false,
          toastVisible: true,
          unsavedChanges: false
        });
      });
    });
  };

  updateMember = data => {
    const { member } = this.state;

    this.setState({
      member: {
        ...member,
        ...data
      },
      unsavedChanges: true
    });
  };

  displayLeader = key => this.state.leaders.find(a => a.value === key);

  render() {
    const { loading, member, leaders, submitting } = this.state;

    return (
      <React.Fragment>
        <Loading visible={loading || submitting} />

        {!loading &&
          !member && (
            <Empty
              message="Member Not Found"
              large
              render={
                <Box pad={{ vertical: 'small' }}>
                  <Button label="Back to Members" path="/members" />
                </Box>
              }
            />
          )}

        {!loading &&
          member &&
          leaders && (
            <Article>
              <Header fixed float={false} direction="column" align="stretch">
                <Box flex direction="row" justify="between">
                  <Box
                    flex={true}
                    pad={{ horizontal: 'medium', vertical: 'small' }}
                  >
                    <Title>{`Member | ${member.name}`}</Title>
                    <Paragraph margin="none">{this.getAreaLeader()}</Paragraph>
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

              <Loading visible={this.state.loading} />

              {!loading && (
                <Box pad={{ horizontal: 'medium' }}>
                  <Form onSubmit={this.saveChanges} disabled={submitting}>
                    <FormFields>
                      <Box pad={{ vertical: 'small' }}>
                        <FormField label="Name">
                          <TextInput
                            value={member.name}
                            autoComplete="off"
                            required
                            onDOMChange={({ target }) =>
                              this.updateMember({ name: target.value })
                            }
                          />
                        </FormField>
                      </Box>

                      <Box pad={{ vertical: 'small' }}>
                        <FormField label="Area Leader">
                          <Select
                            value={this.displayLeader(member.area)}
                            required
                            options={[
                              { value: null, label: 'Unassigned' },
                              ...leaders
                            ]}
                            onChange={({ value }) => {
                              this.updateMember({ area: value.value });
                            }}
                          />
                        </FormField>
                      </Box>

                      <Box pad={{ vertical: 'small' }}>
                        <FormField label="House Number">
                          <TextInput
                            autoComplete="off"
                            type="tel"
                            value={member.house}
                            onDOMChange={({ target }) =>
                              this.updateMember({ house: target.value })
                            }
                          />
                        </FormField>
                      </Box>

                      <Box pad={{ vertical: 'small' }}>
                        <FormField label="Cell Number">
                          <TextInput
                            value={member.cell}
                            type="tel"
                            autoComplete="off"
                            onDOMChange={({ target }) =>
                              this.updateMember({ cell: target.value })
                            }
                          />
                        </FormField>
                      </Box>

                      <Box pad={{ vertical: 'small' }}>
                        <FormField label="Email Address">
                          <TextInput
                            autoComplete="off"
                            type="email"
                            value={member.email}
                            onDOMChange={({ target }) =>
                              this.updateMember({ email: target.value })
                            }
                          />
                        </FormField>
                      </Box>
                    </FormFields>
                  </Form>
                </Box>
              )}
            </Article>
          )}

        {this.state.toastVisible && (
          <Toast
            status="ok"
            duration={2000}
            onClose={() => this.setState({ toastVisible: false })}
          >
            Member Updated.
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
