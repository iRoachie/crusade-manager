import React from 'react';
import Box from 'grommet/components/Box';
import Title from 'grommet/components/Title';
import Button from 'grommet/components/Button';
import Paragraph from 'grommet/components/Paragraph';
import Label from 'grommet/components/Label';

const ContactCard = ({ contact, path, areaLeader, showAreaLeader }) => (
  <Box
    pad={{ horizontal: 'small', vertical: 'small' }}
    colorIndex="light-2"
    className="arealeader-box"
  >
    <Box
      justify="between"
      direction="row"
      responsive={false}
      align="start"
      className="arealeader-box__item--name"
    >
      <Title className="arealeader-box__title">
        <span className="arealeader-box__number">#{contact.number}</span>{' '}
        {contact.name}
      </Title>
      <Button
        label="View"
        className="hide-print arealeader-box__view"
        path={`/contacts/${path}`}
        primary
        style={{
          padding: '0 4px',
          minWidth: 0,
          marginRight: 2
        }}
      />
    </Box>

    {showAreaLeader && (
      <Box pad={{ vertical: 'small' }} className="arealeader-box__item">
        <Paragraph className="arealeader-box__label" margin="none">
          Area Leader
        </Paragraph>
        <Label margin="none">{areaLeader}</Label>
      </Box>
    )}

    <Box pad={{ vertical: 'small' }} className="arealeader-box__item">
      <Paragraph className="arealeader-box__label" margin="none">
        House Phone
      </Paragraph>
      <Label margin="none">{contact.house || '-'}</Label>
    </Box>

    <Box pad={{ vertical: 'small' }} className="arealeader-box__item">
      <Paragraph className="arealeader-box__label" margin="none">
        Cell Phone
      </Paragraph>
      <Label margin="none">{contact.cell || '-'}</Label>
    </Box>

    <Box pad={{ vertical: 'small' }} className="arealeader-box__item">
      <Paragraph className="arealeader-box__label" margin="none">
        Address
      </Paragraph>
      <Label margin="none">{contact.address || '-'}</Label>
    </Box>
  </Box>
);

ContactCard.defaultProps = {
  areaLeader: 'NO AREA LEADER',
  showAreaLeader: true
};

export default ContactCard;
