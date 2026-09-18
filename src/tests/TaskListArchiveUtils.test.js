import { buildArchivedTaskMapForDoneTasks, getDoneTasks } from '../utils/TaskArchiveUtils';

describe('TaskArchiveUtils', () => {
  test('getDoneTasks keeps only completed tasks', () => {
    const tasks = [
      { id: 'a', text: 'Done', reminder: true },
      { id: 'b', text: 'Open', reminder: false },
      { id: 'c', text: 'Also done', reminder: true },
    ];

    expect(getDoneTasks(tasks)).toEqual([
      { id: 'a', text: 'Done', reminder: true },
      { id: 'c', text: 'Also done', reminder: true },
    ]);
  });

  test('buildArchivedTaskMapForDoneTasks strips id from stored values', () => {
    const tasks = [
      { id: 'a', text: 'Done', reminder: true },
      { id: 'b', text: 'Open', reminder: false },
    ];

    expect(buildArchivedTaskMapForDoneTasks(tasks)).toEqual({
      a: { text: 'Done', reminder: true },
    });
  });

  test('buildArchivedTaskMapForDoneTasks preserves only completed tasks when mixed with open tasks', () => {
    const tasks = [
      { id: 'a', text: 'Done', reminder: true },
      { id: 'b', text: 'Open', reminder: false },
      { id: 'c', text: 'Also done', reminder: true },
    ];

    expect(buildArchivedTaskMapForDoneTasks(tasks)).toEqual({
      a: { text: 'Done', reminder: true },
      c: { text: 'Also done', reminder: true },
    });
  });
});
