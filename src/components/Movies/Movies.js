import Movie from './Movie';

const Movies = ({ movies, onDelete }) => {

  return (
    <div>
      {movies.map((movie) => (
        <Movie key={movie.id} movie={movie} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default Movies
