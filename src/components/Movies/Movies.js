import Movie from './Movie';

export default function Movies({ movies, onDelete, onEdit }) {

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
