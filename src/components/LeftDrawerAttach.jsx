import React, { useState } from 'react';
import Button from '@mui/material/Button';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import storage from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { ImAttachment } from "react-icons/im";
import { MdFileUpload } from "react-icons/md";

const LeftDrawerAttach = () => {
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [open, setOpen] = useState(false);

  // --------------------------- Functions ---------------------------

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // File change handler
  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  // File upload handler
  const handleUpload = () => {
    if (!file) {
      alert("Please choose a file first!"); // TODO
    }
    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        setPercent(percent); // update progress

        if (percent === 100) {
          // Close drawer after 2 seconds of successful uploading
          setTimeout(() => {
            setOpen(false);
            setPercent(0);
          }, 2000)
        }
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
        });
      }
    );
  };

  // --------------------------- Render ---------------------------

  return (
    <div>
      <Button onClick={toggleDrawer(true)}><ImAttachment className='settings-icon attach-icon' /></Button>
      <SwipeableDrawer
        className='left-drawer'
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        disableSwipeToOpen={false}
      >
        <div className='drawer-container'>
          <h3>Attach file</h3>
          <div>
            <input className='choose-file' type="file" onChange={handleChange} accept="" />
            <Button className='settings-button upload-button' onClick={handleUpload} variant="none"><MdFileUpload className='settings-icon upload-icon' /></Button>
            <p>{percent}% uploaded</p>
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  )
};

export default LeftDrawerAttach;