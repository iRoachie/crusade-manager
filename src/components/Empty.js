import React from 'react';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';

const Empty = ({ message, render, large }) => (
  <Box justify="center" flex align="center" pad={{ vertical: 'medium' }}>
    <Heading tag={large ? 'h3' : 'h4'}>{message}</Heading>

    {render}
  </Box>
);

export default Empty;
