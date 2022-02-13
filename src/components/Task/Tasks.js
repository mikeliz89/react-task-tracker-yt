import Task from './Task'

const Tasks = ({taskListID, tasks, onDelete, onToggle}) => {

    return (
        <>
          {tasks.map((task) => (
          <Task key={task.id} 
          task={task} 
          taskListID={taskListID}
          onDelete={onDelete} 
          onToggle={onToggle} />
          ))}  
        </>
    )
}

export default Tasks
