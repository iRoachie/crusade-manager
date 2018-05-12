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

import { Loading, Empty } from '../../components';

export default class Members extends React.Component {
  state = {
    search: '',
    status: 'initial',
    areas: [],
    members: []
  };

  componentDidMount() {
    const database = firebase.database();
    this.membersRef = database.ref('/members');
    this.areasRef = database.ref('/areas');
    this.getAreas();
    this.getMembers();
  }

  componentWillUnmount() {
    this.membersRef.off();
    this.areasRef.off();
  }

  getAreas = () => {
    this.setState({ status: 'loading' }, () => {
      this.areasRef.on('value', snapshot => {
        const areas = snapshot.val();

        if (areas) {
          this.setState({ areas: entries(areas), status: 'loaded' });
        } else {
          this.setState({ status: 'loaded' });
        }
      });
    });
  };

  getMembers = () => {
    this.setState({ status: 'loading' }, () => {
      this.membersRef.on('value', snapshot => {
        const members = snapshot.val();

        if (members) {
          this.setState({ members: entries(members), status: 'loaded' });
        } else {
          this.setState({ status: 'loaded' });
        }
      });
    });
  };

  filterList = () => {
    const { members, search } = this.state;

    if (search === '') {
      return members;
    }

    return members.filter(([_, member]) =>
      member.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  getAreaLeader = member => {
    const areaRef = member.area;
    const area = this.state.areas.find(a => a[0] === areaRef);
    return area ? area[1].leader : 'NO AREA LEADER';
  };

  render() {
    const members = this.filterList();
    const { status } = this.state;

    return (
      <Article>
        <Header fixed float={false} pad={{ horizontal: 'medium' }}>
          <Box direction="row" justify="between" flex={true}>
            <Title>Members</Title>
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
            <Button label="New Member" path="members/new" />
          </Box>
        </Header>

        <Loading visible={status === 'loading'} />

        {status === 'loaded' &&
          this.state.members.length === 0 && (
            <Empty message="No Members Added" />
          )}

        {status === 'loaded' &&
          this.state.members.length > 0 &&
          members.length === 0 && (
            <Empty message="No Members found for that search" />
          )}

        {status === 'loaded' &&
          members.length > 0 && (
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
                  <Box
                    justify="between"
                    flex={true}
                    direction="row"
                    responsive={false}
                  >
                    <Title>{member.name}</Title>
                    <Button
                      label="View"
                      path={`members/${key}`}
                      primary
                      style={{ padding: '0 4px', minWidth: 0, marginRight: 2 }}
                    />
                  </Box>

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
          )}
      </Article>
    );
  }
}
