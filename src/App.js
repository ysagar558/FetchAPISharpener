import React, { useState,useEffect, use} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

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

    const response = await fetch('https://appointment-booking-syst-e0829-default-rtdb.firebaseio.com/movies1.json');
    if(!response.ok){
      throw new Error("Something went wrong...Retrying");
    }
    const data = await response.json();
    const loadedMovies=[];

    for(let key in data){
      loadedMovies.push({
        id:key,
        title:data[key].title,
        openingText:data[key].openingText,
        releaseDate:data[key].releaseDate,
      });
    }

    // const transformedMovies = data.results.map((movieData) => {
    //   return {
    //     id: movieData.episode_id,
    //     title: movieData.title,
    //     openingText: movieData.opening_crawl,
    //     releaseDate: movieData.release_date,
    //   };
    // });
    setMovies(loadedMovies);
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

   const addMovieHandler=async (movie)=>{
   const response=await fetch("https://appointment-booking-syst-e0829-default-rtdb.firebaseio.com/movies1.json",{
    method:"POST",
    body:JSON.stringify(movie),
    headers:{
      "Content-Type":"application/json"
    }
   });
   const data=await response.json();
   console.log(data);
  }

  const deleteMovieHandler = async (movieId) => {
  try {
    await fetch(
      `https://appointment-booking-syst-e0829-default-rtdb.firebaseio.com/movies1/${movieId}.json`,
      {
        method: "DELETE",
      }
    );

    // ✅ Update UI immediately
    setMovies((prevMovies) =>
      prevMovies.filter((movie) => movie.id !== movieId)
    );
  } catch (error) {
    alert("Failed to delete movie");
  }
};



  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading&&<MoviesList movies={movies} onDeleteMovie1={deleteMovieHandler}/>}
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