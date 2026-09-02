import Task from './Task';
import Counter from '../Site/Counter';

export default function Tasks({
  taskListID,
  items,
  archived,
  originalList,
  counter,
  counterText,
  onDelete,
  onToggle,
  selectedIds,
  onSelectToggle }) {

  return (
    <div className="tasksList">
      {
        originalList != null && counter != null ? (
          <Counter list={items} originalList={originalList} counter={counter} text={counterText} />
        ) : (<></>)
      }
      {items.map((task) => (
        <Task key={task.id}
          archived={archived}
          task={task}
          taskListID={taskListID}
          onDelete={onDelete}
          isSelected={selectedIds?.has(task.id)}
          selectedIds={selectedIds}
          onToggle={onToggle}
          onSelectToggle={onSelectToggle} />
      ))}
    </div>
  )
}

