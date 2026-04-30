import Counter from '../Site/Counter';

import Movie from './Movie';

export default function Movies({ items, onDelete, onEdit, originalList, counter }) {

  return (
    <div>
      {
        originalList != null && counter != null ? (
          <Counter list={items} originalList={originalList} counter={counter} />
        ) : (<></>)
      }
      {items.map((movie) => (
        <Movie key={movie.id}
          movie={movie}
          onDelete={onDelete}
          onEdit={onEdit} />
      ))}
    </div>
  )
}



