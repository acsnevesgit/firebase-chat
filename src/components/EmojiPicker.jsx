import React, { useState } from 'react';
import Picker from 'emoji-picker-react';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import { BsEmojiSmileFill } from "react-icons/bs";

const EmojiPicker = () => {
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // console.log(chosenEmoji.emoji);

  // --------------------------- Functions ---------------------------

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  const EmojiData = ({chosenEmoji}) => (
    <div style={{textAlign: 'center',marginRight: '810px'}}>
      <br></br>
      <br></br>
      <hr></hr>
      <strong>Names:</strong> {chosenEmoji.names.join(', ')}<br/>
      <strong>Symbol:</strong> {chosenEmoji.emoji}<br/>
    </div>
  );

  // --------------------------- Render ---------------------------

  return (
    <div>
      <Button onClick={handleOpen}><BsEmojiSmileFill className='settings-icon emoji-icon' /></Button>
      <Popover
        className='emoji-popover'
        open={open}
        onClose={handleClose}
      >
        <div className='picker'>
            <Picker className='emoji-picker' onEmojiClick={onEmojiClick}/>
            { chosenEmoji && <EmojiData chosenEmoji={chosenEmoji}/>}
        </div>
      </Popover>
    </div>
  )
};

export default EmojiPicker;