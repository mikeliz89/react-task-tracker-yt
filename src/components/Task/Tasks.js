import Task from './Task';

export default function Tasks({
  taskListID, tasks, archived,
  onDelete,
  onToggle,
  selectedIds,
  onSelectToggle }) {

  return (
    <>
      {tasks.map((task) => (
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
    </>
  )
}
