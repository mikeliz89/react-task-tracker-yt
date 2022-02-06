import TaskList from './TaskList'

const TaskLists = ({taskLists, onDelete}) => {
    return (
        <>
          {taskLists.map((taskList) => (
            <TaskList 
            key={taskList.id} 
            taskList={taskList} 
            onDelete={onDelete} />))}  
        </>
    )
}

export default TaskLists
