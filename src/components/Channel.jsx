import React, { useEffect, useState, useRef } from 'react';
import firebase from 'firebase/compat/app';
import { useFirestoreQuery } from '../hooks';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import { FcBookmark, FcFolder, FcInfo, FcLike, FcLikePlaceholder, FcPicture, FcPhone, FcSettings, FcSearch, FcEmptyTrash, FcVideoCall } from "react-icons/fc";

// Components
import Message from './Message';
import {colorTheme} from '../themes/colorTheme';

const Channel = ({ user = null }) => {
  const db = firebase.firestore();
  const messagesRef = db.collection('messages');
  const messages = useFirestoreQuery(messagesRef.orderBy('createdAt', 'desc').limit(100));

  // States
  const [newMessage, setNewMessage] = useState('');

  const inputRef = useRef();
  const bottomListRef = useRef();
  const { uid, displayName, photoURL } = user;

  // Sign-out
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error.message);
    }
  };

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

  console.log('Canal - ', displayName);

  Channel.propTypes = {
    user: PropTypes.shape({
      uid: PropTypes.string,
      displayName: PropTypes.string,
      photoURL: PropTypes.string,
    }),
  };

  // --------------------------- Render ---------------------------

  return (
    <div className="content-messages">
      <div className="content-messages-container">
        <div className="message-header">
          <div className='sign-out'>
            {user ? (
              <Button
                className="sign-out-button"
                variant="outlined"
                onClick={signOut}
              >
                Sign out
              </Button>
            ) : null}
          </div>
          <ButtonGroup className='settings-button' disabled type="submit" variant="none">
            <Button><FcInfo className='settings-icon' /></Button>
            <Button><FcSearch className='settings-icon' /></Button>
            <Button><FcBookmark className='settings-icon' /></Button>
            <Button><FcPhone className='settings-icon' /></Button>
            <Button><FcVideoCall className='settings-icon' /></Button>
            <Button><FcEmptyTrash className='settings-icon' /></Button>
            <Button><FcSettings className='settings-icon' /></Button>
          </ButtonGroup>
        </div>
        <div className="chat-main">
          <div className="chat-list">
            <ul>
              {messages
                ?.sort((first, second) =>
                  first?.createdAt?.seconds <= second?.createdAt?.seconds ? -1 : 1
                )
                ?.map(message => (
                  <li key={message.id} className={message.displayName === displayName ? 'self' : 'other'}>
                    <Message {...message} />
                  </li>
                ))}
            </ul>
            <div ref={bottomListRef} />
          </div>
          <div className="message">
            <div className='message-options'>
              <ButtonGroup className='settings-button' disabled type="submit" variant="outlined">
                <Button><FcPicture className='settings-icon' /></Button>
                <Button><FcFolder className='settings-icon' /></Button>
              </ButtonGroup>
            </div>
            <form
              onSubmit={handleOnSubmit}
              className="send-message"
            >
              <TextField
                fullWidth
                color="warning"
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
                className="send-button"
              // endIcon={<FcOk className='settings-icon' />}
              >Send
              </Button>
            </form>
          </div>
        </div>
        <div className="message-footer" />
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