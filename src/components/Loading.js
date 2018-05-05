import React from 'react';
import Box from 'grommet/components/Box';
import Spinning from 'grommet/components/icons/Spinning';

const Loading = () => (
  <Box
    flex={true}
    pad={{ horizontal: 'medium', vertical: 'medium' }}
    justify="center"
    align="center"
  >
    <Spinning size="medium" />
  </Box>
);

export default Loading;
