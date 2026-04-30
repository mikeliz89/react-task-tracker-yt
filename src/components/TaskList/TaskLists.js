import Counter from '../Site/Counter';
import TaskList from '../TaskList/TaskList';

export default function TaskLists({ items, archived, onDelete, originalList, counter, counterText }) {
  return (
    <>
      {
        originalList != null && counter != null ? (
          <Counter list={items} originalList={originalList} counter={counter} text={counterText} />
        ) : (<></>)
      }
      {items
        ? items.map((taskList, index) =>
          <TaskList
            archived={archived}
            key={taskList.id}
            taskList={taskList}
            onDelete={onDelete} />) : ''
      }
    </>
  )
}



