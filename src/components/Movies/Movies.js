import Movie from './Movie';
import Counter from '../Site/Counter';

export default function Movies({ movies, onDelete, onEdit, originalList, counter }) {

  return (
    <div>
      {
        originalList != null && counter != null ? (
          <Counter list={movies} originalList={originalList} counter={counter} />
        ) : (<></>)
      }
      {movies.map((movie) => (
        <Movie key={movie.id}
          movie={movie}
          onDelete={onDelete}
          onEdit={onEdit} />
      ))}
    </div>
  )
}
