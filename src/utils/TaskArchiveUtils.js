export function getDoneTasks(tasks = []) {
  return (Array.isArray(tasks) ? tasks : []).filter((task) => task?.reminder === true);
}

export function buildArchivedTaskMapForDoneTasks(tasks = []) {
  const doneTasks = getDoneTasks(tasks);
  const updates = {};

  doneTasks.forEach((task) => {
    const { id, ...taskWithoutId } = task;
    updates[id] = taskWithoutId;
  });

  return updates;
}
