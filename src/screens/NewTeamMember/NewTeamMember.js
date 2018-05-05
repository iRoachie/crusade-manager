import React from 'react';
import entries from 'object.entries';

import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import Footer from 'grommet/components/Footer';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Toast from 'grommet/components/Toast';
import Select from 'grommet/components/Select';
import Spinning from 'grommet/components/icons/Spinning';

import { Loading } from '../../components';

import firebase from 'firebase';

export default class NewTeamMember extends React.Component {
  state = {
    name: '',
    leader: null,
    house: '',
    cell: '',
    email: '',
    leaders: [],
    loading: false,
    toastVisible: false,
    submitting: false
  };

  componentDidMount() {
    const database = firebase.database();
    this.ref = database.ref('/areas');
    this.getLeaders();
  }

  componentWillUnmount() {
    this.ref.off();
  }

  getLeaders = () => {
    this.setState({ loading: true }, () => {
      this.ref.on('value', snapshot => {
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

  addTeam = e => {
    e.preventDefault();
    const {
      loading,
      submitting,
      toastVisible,
      leaders,
      leader,
      ...rest
    } = this.state;

    rest.area = leader.value;

    this.setState({ submitting: true }, () => {
      const database = firebase.database();
      database
        .ref('/members')
        .push(rest)
        .then(() => {
          this.setState({
            toastVisible: !toastVisible,
            submitting: false,
            leader: null,
            name: '',
            house: '',
            cell: '',
            email: ''
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
            Team Member Added.
          </Toast>
        )}

        <Article>
          <Header fixed float={false} pad={{ horizontal: 'medium' }}>
            <Title>New Team Member</Title>
          </Header>

          {this.state.loading ? (
            <Loading />
          ) : (
            <Box pad={{ horizontal: 'medium' }}>
              <Form onSubmit={this.addTeam} disabled={this.state.submitting}>
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
                    <FormField label="Area Leader">
                      <Select
                        value={this.state.leader}
                        required
                        options={this.state.leaders}
                        onChange={({ value }) => {
                          this.setState({ leader: value });
                        }}
                      />
                    </FormField>
                  </Box>

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
              </Form>
            </Box>
          )}
        </Article>
      </React.Fragment>
    );
  }
}
