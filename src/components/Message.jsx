import React from 'react';
import PropTypes from 'prop-types';
import { formatRelative } from 'date-fns';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

const formatDate = date => {
  let formattedDate = '';
  if (date) {
    formattedDate = formatRelative(date, new Date()); // Convert the date in words relative to the current date
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1); // Uppercase the first letter
  }
  return formattedDate;
};

const Message = ({
  createdAt = null,
  text = '',
  displayName = '',
  photoURL = '',
}) => {

  // if no new message, do nothing
  if (!text) return null;

  // if new message, render newest chat status
  return (
    <div className="message-info">
      <div className="user-photo">
      {photoURL ? (
        <Avatar
          src={photoURL}
          alt="avatar"
          className="avatar"
          sx={{ width: 60, height: 60 }}
        />
      ) : null}
      </div>
      <div  className="text-message">
        <div className="user-name">
          {displayName ? (
            <p className="display-name">{displayName}</p>
          ) : null}
          {createdAt?.seconds ? (
            <p className="timestamp">
              {formatDate(new Date(createdAt.seconds * 1000))}
            </p>
          ) : null}
        </div>
        <p className="user-message">{text}</p>
      </div>
    </div>
  );
};

Message.propTypes = {
  text: PropTypes.string,
  createdAt: PropTypes.shape({
    seconds: PropTypes.number,
  }),
  displayName: PropTypes.string,
  photoURL: PropTypes.string,
};

export default Message;