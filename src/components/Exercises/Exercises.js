import Exercise from './Exercise';

export default function Exercises({ exercises, onDelete }) {

  return (
    <div>
      {exercises.map((exercise) => (
        <Exercise key={exercise.id} exercise={exercise} onDelete={onDelete} />
      ))}
    </div>
  )
}

