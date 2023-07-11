import Movie from './Movie';

const Movies = ({ movies, onDelete, onEdit }) => {

  return (
    <div>
      {movies.map((movie) => (
        <Movie key={movie.id}
          movie={movie}
          onDelete={onDelete}
          onEdit={onEdit} />
      ))}
    </div>
  )
}

export default Movies
