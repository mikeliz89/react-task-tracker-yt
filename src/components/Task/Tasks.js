import Task from './Task';

export default function Tasks({ taskListID, tasks, archived, onDelete, onToggle }) {

  return (
    <>
      {tasks.map((task) => (
        <Task key={task.id}
          archived={archived}
          task={task}
          taskListID={taskListID}
          onDelete={onDelete}
          onToggle={onToggle} />
      ))}
    </>
  )
}
