import TaskList from '../TaskList/TaskList'

const TaskLists = ({ taskLists, archived, onDelete }) => {
  return (
    <>
      {taskLists
        ? taskLists.map((taskList, index) =>
          <TaskList
            archived={archived}
            key={taskList.id}
            taskList={taskList}
            onDelete={onDelete} />) : ''
      }
    </>
  )
}

export default TaskLists
