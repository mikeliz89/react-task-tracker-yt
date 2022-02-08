import TaskList from '../TaskList/TaskList'

const TaskLists = ({taskLists, onDelete}) => {
    return (
        <>
          {taskLists 
            ? taskLists.map((taskList, index) =>
            <TaskList 
            key={taskList.id} 
            taskList={taskList} 
            onDelete={onDelete} />) : ''
          }
        </>
    )
}

export default TaskLists
