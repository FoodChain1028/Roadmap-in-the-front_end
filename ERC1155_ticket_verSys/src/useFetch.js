import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortCont = new AbortController();
    
    setTimeout(() => { 
      fetch(url, { signal: abortCont.signal })
      .then(res => {
        if (!res.ok) { // error coming back from server
          throw Error('could not fetch the data for that resource');
        } 
        return res.json();
      })
      .then(data => {
        setData(data); 
        setIsPending(false);
        setError(null);
      })
      // send error
      .catch(err => {
        if (err.name === 'AbortError') {
          console.log('fetch aborted');
        }else {
          setIsPending(false);
          setError(err.message);
        }
      })
    }, 100);
    return () => abortCont.abort();
  }, [url]);

  return { data, isPending, error };
}

export default useFetch;