import React, { useEffect, useState, useRef } from 'react';
import firebase from 'firebase/compat/app';
import { useFirestoreQuery } from '../hooks';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TextField from '@mui/material/TextField';
import { FaSearch, FaTrash } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import { BsFillBookmarkStarFill, BsCameraVideoFill, BsFillInfoCircleFill } from "react-icons/bs";

// Components
import Message from './Message';
import LeftDrawerAttach from './LeftDrawerAttach';
import EmojiPicker from './EmojiPicker';

const Channel = ({ user = null }) => {
  const db = firebase.firestore();
  const messagesRef = db.collection('messages');
  const messages = useFirestoreQuery(messagesRef.orderBy('createdAt', 'desc').limit(100));

  // States
  const [newMessage, setNewMessage] = useState('');

  const inputRef = useRef();
  const bottomListRef = useRef();

  const { uid, displayName, photoURL } = user;
  localStorage.setItem('currentUsername', JSON.stringify(displayName));

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  // --------------------------- Functions ---------------------------

  // Get emoji
  const getEmojiOnClick = async (event) => {
    console.log(event.target);
  };

  // Sign-out
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error.message);
    }
  };

  // Message change Handler
  const handleOnChange = event => {
    setNewMessage(event.target.value);
  };

  // Message submit handler
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
            <Button><BsFillInfoCircleFill className='settings-icon info-icon' /></Button>
            <Button><FaSearch className='settings-icon search-icon' /></Button>
            <Button><BsFillBookmarkStarFill className='settings-icon bookmark-icon' /></Button>
            <Button><IoMdNotifications className='settings-icon notification-icon' /></Button>
            <Button><BsCameraVideoFill className='settings-icon video-icon' /></Button>
            <Button><FaTrash className='settings-icon trash-icon' /></Button>
            <Button><IoSettingsSharp className='settings-icon setting-icon' /></Button>
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
              <ButtonGroup className='settings-button' type="submit" variant="outlined">
                <div className='icons'>
                  {/* // TODO: find way to send emoji on message */}
                  <EmojiPicker />
                  <LeftDrawerAttach />
                </div>
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
                className={"send-button"}
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