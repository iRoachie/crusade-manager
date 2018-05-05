import React from 'react';
import firebase from 'firebase';
import entries from 'object.entries';

import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Search from 'grommet/components/Search';
import Button from 'grommet/components/Button';
import Label from 'grommet/components/Label';
import Paragraph from 'grommet/components/Paragraph';
import Spinning from 'grommet/components/icons/Spinning';

export default class AreaLeaders extends React.Component {
  state = {
    search: '',
    loading: false,
    leaders: []
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
          this.setState({ leaders: entries(leaders), loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
    });
  };

  newTeam = () => {
    this.props.history.push('leaders/new');
  };

  filterList = () => {
    const { leaders, search } = this.state;

    if (search === '') {
      return leaders;
    }

    return leaders.filter(([_, item]) =>
      item.leader.toLowerCase().includes(search.toLowerCase())
    );
  };

  render() {
    const leaders = this.filterList();

    return (
      <Article>
        <Header fixed float={false} pad={{ horizontal: 'medium' }}>
          <Box direction="row" justify="between" flex={true}>
            <Title>Area Leaders</Title>
            <Box flex={true} justify="end" direction="row" responsive={true}>
              <Search
                inline={true}
                fill={true}
                size="medium"
                placeHolder="Search"
                dropAlign={{ right: 'right' }}
                value={this.state.search}
                onDOMChange={e => this.setState({ search: e.target.value })}
              />
            </Box>
          </Box>

          <Box pad={{ horizontal: 'small', vertical: 'small' }}>
            <Button label="New Area Leader" onClick={this.newTeam} />
          </Box>
        </Header>

        {this.state.loading && (
          <Box
            flex={true}
            pad={{ horizontal: 'medium', vertical: 'medium' }}
            justify="center"
            align="center"
          >
            <Spinning size="medium" />
          </Box>
        )}

        <Box
          pad={{ horizontal: 'medium', vertical: 'medium' }}
          flex={true}
          direction="row"
          wrap={true}
        >
          {leaders.map(([key, item]) => (
            <Box
              key={key}
              pad={{ horizontal: 'small', vertical: 'small' }}
              colorIndex="light-2"
              className="arealeader-box"
            >
              <Title>{item.leader}</Title>

              <Box pad={{ vertical: 'small' }}>
                <Paragraph className="arealeader-box__label" margin="none">
                  House Phone
                </Paragraph>
                <Label margin="none">{item.house}</Label>
              </Box>

              <Box pad={{ vertical: 'small' }}>
                <Paragraph className="arealeader-box__label" margin="none">
                  Cell Phone
                </Paragraph>
                <Label margin="none">{item.cell}</Label>
              </Box>

              <Box pad={{ vertical: 'small' }}>
                <Paragraph className="arealeader-box__label" margin="none">
                  Email
                </Paragraph>
                <Label margin="none">{item.email}</Label>
              </Box>

              <Box pad={{ vertical: 'small' }}>
                <Paragraph className="arealeader-box__label" margin="none">
                  Area Address
                </Paragraph>
                <Label margin="none">{item.address}</Label>
              </Box>
            </Box>
          ))}
        </Box>
      </Article>
    );
  }
}
