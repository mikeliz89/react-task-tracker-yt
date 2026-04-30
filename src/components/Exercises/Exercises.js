import Counter from '../Site/Counter';

import Exercise from './Exercise';

export default function Exercises({ items, originalList, counter, onDelete }) {

  return (
    <div>
      <Counter list={items} originalList={originalList} counter={counter} />
      {items.map((exercise) => (
        <Exercise key={exercise.id} exercise={exercise} onDelete={onDelete} />
      ))}
    </div>
  )
}

