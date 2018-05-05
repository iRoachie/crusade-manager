import React from 'react';
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Paragraph from 'grommet/components/Paragraph';
import Label from 'grommet/components/Label';

const PersonCard = ({ person }) => (
  <Box
    pad={{ horizontal: 'small', vertical: 'small' }}
    colorIndex="light-2"
    className="arealeader-box"
  >
    {person.name && <Title>{person.name}</Title>}

    <Box pad={{ vertical: 'small' }}>
      <Paragraph className="arealeader-box__label" margin="none">
        House Phone
      </Paragraph>
      <Label margin="none">{person.house}</Label>
    </Box>

    <Box pad={{ vertical: 'small' }}>
      <Paragraph className="arealeader-box__label" margin="none">
        Cell Phone
      </Paragraph>
      <Label margin="none">{person.cell}</Label>
    </Box>

    <Box pad={{ vertical: 'small' }}>
      <Paragraph className="arealeader-box__label" margin="none">
        Email
      </Paragraph>
      <Label margin="none">{person.email}</Label>
    </Box>
  </Box>
);

export default PersonCard;
