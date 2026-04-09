import Counter from '../Site/Counter';

import Exercise from './Exercise';

export default function Exercises({ exercises, originalList, counter, onDelete }) {

  return (
    <div>
      <Counter list={exercises} originalList={originalList} counter={counter} />
      {exercises.map((exercise) => (
        <Exercise key={exercise.id} exercise={exercise} onDelete={onDelete} />
      ))}
    </div>
  )
}

