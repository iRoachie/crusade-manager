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

import { Loading } from '../../components';

export default class Members extends React.Component {
  state = {
    search: '',
    loading: false,
    leaders: [],
    members: []
  };

  componentDidMount() {
    const database = firebase.database();
    this.membersRef = database.ref('/members');
    this.leadersRef = database.ref('/areas');
    this.getLeaders();
    this.getMembers();
  }

  componentWillUnmount() {
    this.membersRef.off();
    this.leadersRef.off();
  }

  getLeaders = () => {
    this.setState({ loading: true }, () => {
      this.leadersRef.on('value', snapshot => {
        const leaders = snapshot.val();

        if (leaders) {
          this.setState({ leaders: entries(leaders), loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
    });
  };

  getMembers = () => {
    this.setState({ loading: true }, () => {
      this.membersRef.on('value', snapshot => {
        const members = snapshot.val();

        if (members) {
          this.setState({ members: entries(members), loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
    });
  };

  newMember = () => {
    this.props.history.push('members/new');
  };

  filterList = () => {
    const { members, search } = this.state;

    if (search === '') {
      return members;
    }

    return members.filter(([_, item]) =>
      item.leader.toLowerCase().includes(search.toLowerCase())
    );
  };

  getAreaLeader = member => {
    const leaderRef = member.leader;
    const leader = this.state.leaders.find(a => a[0] === leaderRef);
    return leader[1].leader;
  };

  render() {
    const members = this.filterList();

    return (
      <Article>
        <Header fixed float={false} pad={{ horizontal: 'medium' }}>
          <Box direction="row" justify="between" flex={true}>
            <Title>Team Members</Title>
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
            <Button label="New Team Member" onClick={this.newMember} />
          </Box>
        </Header>

        {this.state.loading && <Loading />}

        <Box
          pad={{ horizontal: 'medium', vertical: 'medium' }}
          flex={true}
          direction="row"
          wrap={true}
        >
          {members.map(([key, member]) => (
            <Box
              key={key}
              pad={{ horizontal: 'small', vertical: 'small' }}
              colorIndex="light-2"
              className="arealeader-box"
            >
              <Title>{member.name}</Title>

              <Box pad={{ vertical: 'small' }}>
                <Paragraph className="arealeader-box__label" margin="none">
                  Area Leader
                </Paragraph>
                <Label margin="none">{this.getAreaLeader(member)}</Label>
              </Box>

              <Box pad={{ vertical: 'small' }}>
                <Paragraph className="arealeader-box__label" margin="none">
                  House Phone
                </Paragraph>
                <Label margin="none">{member.house}</Label>
              </Box>

              <Box pad={{ vertical: 'small' }}>
                <Paragraph className="arealeader-box__label" margin="none">
                  Cell Phone
                </Paragraph>
                <Label margin="none">{member.cell}</Label>
              </Box>

              <Box pad={{ vertical: 'small' }}>
                <Paragraph className="arealeader-box__label" margin="none">
                  Email
                </Paragraph>
                <Label margin="none">{member.email}</Label>
              </Box>
            </Box>
          ))}
        </Box>
      </Article>
    );
  }
}
