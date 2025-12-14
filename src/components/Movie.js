import React from 'react';

import classes from './Movie.module.css';

const Movie = (props) => {
  
  return (
    <li className={classes.movie} key={props.id}>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
      <button style={{backgroundColor:"red"}}
            onClick={() => props.onDeleteMovie(props.id)}
          >
            Delete Movie
          </button>
    </li>
  );
};

export default Movie;