import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import Button from '@mui/material/Button';

import Loader from './components/Loader';
import Channel from './components/Channel';
import logo from './assets/chatlogo.png';
import './App.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_AUTH_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
// --------------------------- App main ---------------------------

const App = () => {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  // Get the reference to the collection, order it by the timestamp, limit the number of messages returned from the query
  const query = db.collection('messages').orderBy('createdAt').limit(100);

  // States
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(() => firebase.auth().currentUser);
  const [docs, setDocs] = useState([]);

  // --------------------------- Functions ---------------------------

  // Sign-in
  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider(); // Retrieve Google provider object
    firebase.auth().useDeviceLanguage(); // Set language to the default browser preference
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Sign-out
  const signOut = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error.message);
    }
  };

  // Content renderer
  const renderContent = () => {
    if (initializing) {
      return (
        <div className="initializing">
          <Loader />
        </div>
      );
    }

    // if user is logged in, show Channel
    if (user) {
      return (<Channel user={user} />)
    };

    // if user is not logged in, show login page
    return (
      <div className="content">
        <div className="content-container">
          <img className='logo flame' src={logo} alt='logo' />
          <h1 className="logo-title">
            React <span>Firebase</span>-Chat
          </h1>
          <p className="text">
            This 💬 is on 🔥!
          </p>
          <div className="sign-in">
            <Button
              className="sign-in-with-Google"
              variant="outlined"
              onClick={signInWithGoogle}
            >
              Sign in with Google&nbsp;<FcGoogle className="google-icon" />
            </Button>
            <Button
              className="sign-in-with-GitHub"
              variant="outlined"
            // onClick={signInWithGitHub}
            >
              Sign in with GitHub&nbsp;<BsGithub className="github-icon" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // --------------------------- Effects ---------------------------

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
      if (initializing) {
        setInitializing(false);
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, [initializing]);

  useEffect(() => {
    // Subscribe to query with onSnapshot
    const unsubscribe = query.onSnapshot(querySnapshot => {
      // Get all documents from collection
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      // Update state
      setDocs(data);
    });

    // Detach listener
    return unsubscribe;
  }, []);

  // --------------------------- Render ---------------------------

  return (
    <div className="content-logged">
      <div className="content-container-logged">
        <header
          className=""
        >
          <div className="">
            {user ? (
              <Button
                className="sign-out"
                variant="outlined"
                onClick={signOut}
              >
                Sign out
              </Button>
            ) : null}
          </div>
        </header>
        <main
          className="flex-1"
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
