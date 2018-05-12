import React from 'react';
import classNames from 'classnames';
import Notification from 'grommet/components/Notification';

const Alert = ({ visible, message }) => {
  const classes = classNames({
    alert: true,
    'alert--visible': visible
  });

  return (
    <Notification
      className={classes}
      status="warning"
      message={message}
      size="small"
    />
  );
};

export default Alert;
