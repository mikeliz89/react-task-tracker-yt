import TaskList from '../TaskList/TaskList';
import Counter from '../Site/Counter';

export default function TaskLists({ taskLists, archived, onDelete, originalList, counter, counterText }) {
  return (
    <>
      {
        originalList != null && counter != null ? (
          <Counter list={taskLists} originalList={originalList} counter={counter} text={counterText} />
        ) : (<></>)
      }
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
