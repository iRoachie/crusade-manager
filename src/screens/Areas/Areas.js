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

import { Empty, Loading } from '../../components';

export default class Areas extends React.Component {
  state = {
    search: '',
    status: 'initial',
    areas: []
  };

  componentDidMount() {
    const database = firebase.database();
    this.ref = database.ref('/areas');
    this.getAreas();
  }

  componentWillUnmount() {
    this.ref.off();
  }

  getAreas = () => {
    this.setState({ status: 'loading' }, () => {
      this.ref.on('value', snapshot => {
        const areas = snapshot.val();

        if (areas) {
          this.setState({ areas: entries(areas), status: 'loaded' });
        } else {
          this.setState({ status: 'loaded' });
        }
      });
    });
  };

  filterList = () => {
    const { areas, search } = this.state;

    if (search === '') {
      return areas;
    }

    return areas.filter(([_, item]) =>
      item.leader.toLowerCase().includes(search.toLowerCase())
    );
  };

  render() {
    const areas = this.filterList();

    const { status } = this.state;

    return (
      <Article>
        <Header fixed float={false} pad={{ horizontal: 'medium' }}>
          <Box direction="row" justify="between" flex={true}>
            <Title>Areas</Title>
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
            <Button label="New Area" path="areas/new" />
          </Box>
        </Header>

        <Loading visible={status === 'loading'} />

        {status === 'loaded' &&
          this.state.areas.length === 0 && <Empty message="No Areas Added" />}

        {status === 'loaded' &&
          areas.length === 0 &&
          this.state.areas.length > 0 && (
            <Empty message="No Areas found for that search" />
          )}

        {status === 'loaded' &&
          this.state.areas.length > 0 && (
            <Box
              pad={{ horizontal: 'medium', vertical: 'medium' }}
              flex={true}
              direction="row"
              wrap={true}
            >
              {areas.map(([key, item]) => (
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
                    <Title>{item.leader}</Title>
                    <Button
                      label="View"
                      path={`areas/${key}`}
                      primary
                      style={{ padding: '0 4px', minWidth: 0, marginRight: 2 }}
                    />
                  </Box>

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
          )}
      </Article>
    );
  }
}
