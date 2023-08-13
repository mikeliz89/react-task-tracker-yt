import TaskList from '../TaskList/TaskList';

export default function TaskLists({ taskLists, archived, onDelete }) {
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
