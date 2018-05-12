import React from 'react';
import classNames from 'classnames';
import Box from 'grommet/components/Box';
import Spinning from 'grommet/components/icons/Spinning';

const Loading = ({ visible }) => {
  const boxClasses = classNames({
    loading: true,
    'loading--visible': visible
  });

  return (
    <Box flex={true} className={boxClasses} justify="center" align="center">
      <Spinning size="medium" />
    </Box>
  );
};

export default Loading;
