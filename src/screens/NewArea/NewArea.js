import React from 'react';

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
import Spinning from 'grommet/components/icons/Spinning';

import firebase from 'firebase';

export default class NewArea extends React.Component {
  state = {
    leader: '',
    address: '',
    house: '',
    cell: '',
    email: '',
    toastVisible: false,
    submitting: false
  };

  addArea = e => {
    e.preventDefault();
    const { submitting, toastVisible, ...rest } = this.state;

    this.setState({ submitting: true }, () => {
      const database = firebase.database();
      database
        .ref('/areas')
        .push(rest)
        .then(() => {
          this.setState({
            toastVisible: !toastVisible,
            submitting: false,
            leader: '',
            address: '',
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
            New Area Added.
          </Toast>
        )}

        <Article>
          <Header fixed float={false} pad={{ horizontal: 'medium' }}>
            <Title>New Area</Title>
          </Header>

          <Box pad={{ horizontal: 'medium' }}>
            <Form onSubmit={this.addArea} disabled={this.state.submitting}>
              <FormFields>
                <Box pad={{ vertical: 'small' }}>
                  <FormField label="Leader Name">
                    <TextInput
                      value={this.state.leader}
                      autoComplete="off"
                      required
                      onDOMChange={e =>
                        this.setState({ leader: e.target.value })
                      }
                    />
                  </FormField>
                </Box>

                <Box pad={{ vertical: 'small' }}>
                  <FormField label="Area Address">
                    <textarea
                      value={this.state.address}
                      autoComplete="off"
                      rows={5}
                      onChange={e => this.setState({ address: e.target.value })}
                    />
                  </FormField>
                </Box>

                <Box pad={{ vertical: 'small' }}>
                  <FormField label="Leader House Number">
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
                  <FormField label="Leader Cell Number">
                    <TextInput
                      value={this.state.cell}
                      type="tel"
                      autoComplete="off"
                      onDOMChange={e => this.setState({ cell: e.target.value })}
                    />
                  </FormField>
                </Box>

                <Box pad={{ vertical: 'small' }}>
                  <FormField label="Leader Email Address">
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
        </Article>
      </React.Fragment>
    );
  }
}
