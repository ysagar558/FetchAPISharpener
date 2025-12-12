import React, { useState,useEffect, use} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [error,setError]=useState(null);
  const [isRetrying,setIsRetrying]=useState(false);
  const [intervalId, setIntervalId] = useState(null);

  async function fetchMoviesHandler() {
    // fetch('https://swapi.dev/api/films/')
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     const transformedMovies = data.results.map((movieData) => {
    //       return {
    //         id: movieData.episode_id,
    //         title: movieData.title,
    //         openingText: movieData.opening_crawl,
    //         releaseDate: movieData.release_date,
    //       };
    //     });
    //     setMovies(transformedMovies);
    //   });
    setIsLoading(true);
    setError(null);
    try{

    const response = await fetch('https://swapi.dev/api/films/');
    if(!response.ok){
      throw new Error("Something went wrong...Retrying");
    }
    const data = await response.json();

    const transformedMovies = data.results.map((movieData) => {
      return {
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      };
    });
    setMovies(transformedMovies);
  } catch(error){
    setError(error.message);
    setIsRetrying(true);
  }
    setIsLoading(false);
  }
const startRetrying = () => {
    console.log("Started retrying...");
    setIsRetrying(true);

    const id = setInterval(() => {
      fetchMoviesHandler();
    }, 5000);

    setIntervalId(id);
  };

  const stopRetrying = () => {
    console.log("Stopped retrying");
    

    setIsRetrying(false);

    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };
  useEffect(() => {
    fetchMoviesHandler();

    return () => stopRetrying();
  }, [])


  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading&&<MoviesList movies={movies} />}
        {error&&<p>{error}</p>}
        {isLoading&&<p>Loading...</p>}
        {isRetrying && (
        <button onClick={stopRetrying} >
          Cancel Retrying
        </button>
      )}
      {!isRetrying&&error&&<p>Stopped Retrying</p>}
      </section>
    </React.Fragment>
  );
}

export default App;