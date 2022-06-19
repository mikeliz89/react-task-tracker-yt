import Exercise from './Exercise';

const Exercises = ({ exercises, onDelete }) => {

  return (
    <div>
      {exercises.map((exercise) => (
        <Exercise key={exercise.id} exercise={exercise} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default Exercises
