import { useEffect, useState, useRef, useCallback } from 'react';

export function useFirestoreQuery(query) {
  const [docs, setDocs] = useState([]);

  const queryRef = useRef(query); // Store current query in ref

  // Compare current query with the previous one
  useEffect(() => {
    // Use Firestore built-in 'isEqual' method to compare queries
    if (!queryRef?.current?.isEqual(query)) {
      queryRef.current = query;
    }
  });

  // Re-run data listener only if query has changed
  useEffect(() => {
    if (!queryRef.current) {
      return null;
    }

    // Subscribe to query with onSnapshot
    const unsubscribe = queryRef.current.onSnapshot(querySnapshot => {
      // Get all documents from collection with IDs
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDocs(data); // Update state
    });

    return unsubscribe; // Detach listener
  }, [queryRef]);

  return docs;
};

export function useAuthState(auth) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(() => auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe; // Cleanup subscription
  }, [auth, initializing]);

  return { user, initializing };
};

export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key); // Get from local storage by key
      return item ? JSON.parse(item) : initialValue; // Parse stored json or if none return initialValue
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore); // Set state
      window.localStorage.setItem(key, JSON.stringify(valueToStore)); // Save to local storage
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
};

export function useMedia(queries, values, defaultValue) {
  const mediaQueryLists = queries.map(q => window.matchMedia(q)); // Array containing a media query list for each query

  // Function that gets value based on matching media query
  const getValue = useCallback(() => {
    const index = mediaQueryLists.findIndex(mql => mql.matches); // Get index of first media query that matches
    return typeof values[index] !== 'undefined' ? values[index] : defaultValue; // Return related value or defaultValue if none
  }, [mediaQueryLists, values, defaultValue]);

  const [value, setValue] = useState(getValue); // State and setter for matched value

  useEffect(() => {
    // Event listener callback
    // Note: By defining getValue outside of useEffect we ensure that it has current values of hook args
    const handler = () => setValue(getValue);
    mediaQueryLists.forEach(mql => mql.addListener(handler)); // Set a listener for each media query with above handler as callback.
    return () => mediaQueryLists.forEach(mql => mql.removeListener(handler)); // Remove listeners on cleanup
  }, [getValue, mediaQueryLists]);

  return value;
};