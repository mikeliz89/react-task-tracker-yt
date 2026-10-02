const { migrateDatabase, createImportPayload } = require('../../scripts/migrate-user-data');

test('moves owned records and their child collections into the same user namespace', () => {
    const { users, unresolved } = migrateDatabase({
        tasklists: { listA: { title: 'A', createdBy: 'a@example.test' } },
        tasks: { listA: { taskA: { text: 'A task' } } },
        profiles: { uidB: { name: 'B' } },
        links: { linkWithoutOwner: { url: 'https://example.test' } },
    }, { 'a@example.test': 'uidA' });

    expect(users.uidA.tasklists.listA.title).toBe('A');
    expect(users.uidA.tasks.listA.taskA.text).toBe('A task');
    expect(users.uidB.profiles.uidB.name).toBe('B');
    expect(unresolved).toEqual([{ section: 'links', id: 'linkWithoutOwner', reason: 'missing owner' }]);
});

test('never guesses an owner for a child whose parent is missing', () => {
    const { users, unresolved } = migrateDatabase({ tasks: { unknownList: { task: {} } } }, {});
    expect(users).toEqual({});
    expect(unresolved).toEqual([{ section: 'tasks', id: 'unknownList', reason: 'parent owner unknown' }]);
});

test('explicit owner decisions recover ownerless records and dependent children', () => {
    const { users, unresolved } = migrateDatabase({
        tasklists: { oldList: { title: 'Old' } },
        tasks: { oldList: { oldTask: { text: 'Old task' } } },
    }, {}, { tasklists: { oldList: 'uidA' } });
    expect(users.uidA.tasklists.oldList.title).toBe('Old');
    expect(users.uidA.tasks.oldList.oldTask.text).toBe('Old task');
    expect(unresolved).toEqual([]);
});

test('task comments follow their task even though tasks are grouped by list', () => {
    const { users, unresolved } = migrateDatabase({
        tasklists: { listA: { createdBy: 'a@example.test' } },
        tasks: { listA: { taskA: { text: 'Task' } } },
        'task-comments': { taskA: { commentA: { text: 'Comment' } } },
    }, { 'a@example.test': 'uidA' });
    expect(users.uidA['task-comments'].taskA.commentA.text).toBe('Comment');
    expect(unresolved).toEqual([]);
});

test('import payload has users as the top-level key for a root update', () => {
    const result = migrateDatabase({
        tasklists: { listA: { createdBy: 'a@example.test' } },
    }, { 'a@example.test': 'uidA' });
    expect(createImportPayload(result)).toEqual({
        users: { uidA: { tasklists: { listA: { createdBy: 'a@example.test' } } } },
    });
});
