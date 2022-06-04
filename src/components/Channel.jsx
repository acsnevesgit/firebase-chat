import React, { useEffect, useState, useRef } from 'react';
import firebase from 'firebase/compat/app';
import { useFirestoreQuery } from '../hooks';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FcBookmark, FcLike, FcLikePlaceholder, FcNext, FcPhone, FcPrevious, FcSettings, FcSearch, FcEmptyTrash } from "react-icons/fc";

// Components
import Message from './Message';

const Channel = ({ user = null }) => {
  const db = firebase.firestore();
  const messagesRef = db.collection('messages');
  const messages = useFirestoreQuery(
    messagesRef.orderBy('createdAt', 'desc').limit(100)
  );

  // States
  const [newMessage, setNewMessage] = useState('');

  const inputRef = useRef();
  const bottomListRef = useRef();

  const { uid, displayName, photoURL } = user;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  // --------------------------- Functions ---------------------------

  // Handler
  const handleOnChange = event => {
    setNewMessage(event.target.value);
  };

  // Submitter
  const handleOnSubmit = event => {
    event.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      // Add new message in Firestore
      messagesRef.add({
        text: trimmedMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        displayName,
        photoURL,
      });
      setNewMessage(''); // Clear input field
      bottomListRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll down to the bottom of the list
    }
  };

  // --------------------------- Render ---------------------------

  return (
    <div className="content content-messages">
      <div className="content-container content-messages-container">
        <div className="message-header">
        <Button className='settings-button' disabled type="submit" variant="outlined"><FcBookmark className='settings-icon' /></Button>
        <Button className='settings-button' disabled type="submit" variant="outlined"><FcSearch className='settings-icon' /></Button>
        <Button className='settings-button' disabled type="submit" variant="outlined"><FcPhone className='settings-icon' /></Button>
        <Button className='settings-button' disabled type="submit" variant="outlined"><FcEmptyTrash className='settings-icon' /></Button>
        <Button className='settings-button' disabled type="submit" variant="outlined"><FcSettings className='settings-icon' /></Button>
        </div>
        <div className="chat-main">
          <ul>
            {messages
              ?.sort((first, second) =>
                first?.createdAt?.seconds <= second?.createdAt?.seconds ? -1 : 1
              )
              ?.map(message => (
                <li key={message.id}>
                  <Message {...message} />
                </li>
              ))}
          </ul>
          <div ref={bottomListRef} />
          <div className="message">
            <form
              onSubmit={handleOnSubmit}
              className="send-message"
            >
              <TextField
                fullWidth
                color="primary"
                ref={inputRef}
                value={newMessage}
                onChange={handleOnChange}
                className="write-text"
                placeholder='Type here...'
                variant="outlined" />
              <Button
                type="submit"
                disabled={!newMessage}
                variant="outlined"
                className="settings-button send-button"
              >
                <FcNext className='settings-icon'/>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

Channel.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default Channel;