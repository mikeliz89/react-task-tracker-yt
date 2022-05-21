import Task from './Task'

const Tasks = ({ taskListID, tasks, archived, onDelete, onToggle }) => {

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

export default Tasks
