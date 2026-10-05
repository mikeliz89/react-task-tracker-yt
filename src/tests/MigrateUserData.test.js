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
    expect(users['2R6C4xudIrgZGtSQvwBYW4sbfZH2'].links.linkWithoutOwner.url).toBe('https://example.test');
    expect(unresolved).toEqual([]);
});

test('assigns a child without a known parent to the fallback owner', () => {
    const { users, unresolved } = migrateDatabase({ tasks: { unknownList: { task: {} } } }, {});
    expect(users['2R6C4xudIrgZGtSQvwBYW4sbfZH2'].tasks.unknownList).toEqual({ task: {} });
    expect(unresolved).toEqual([]);
});

test('assigns unmapped creators to the fallback owner but keeps mapped creators separate', () => {
    const { users, unresolved } = migrateDatabase({
        movies: {
            known: { createdBy: 'other@example.test' },
            unknown: { createdBy: 'unmapped@example.test' },
        },
    }, { 'other@example.test': 'otherUid' });
    expect(users.otherUid.movies.known.createdBy).toBe('other@example.test');
    expect(users['2R6C4xudIrgZGtSQvwBYW4sbfZH2'].movies.unknown.createdBy).toBe('unmapped@example.test');
    expect(unresolved).toEqual([]);
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
