import { userDatabasePath, userDatabaseUpdates, userStoragePath } from '../datatier/userDatabasePaths';

describe('personal database paths', () => {
    test('scopes a collection and nested record to the signed-in user', () => {
        expect(userDatabasePath('/tasklists', 'user-a')).toBe('users/user-a/tasklists');
        expect(userDatabasePath('/tasks/list-1/task-1', 'user-b')).toBe('users/user-b/tasks/list-1/task-1');
    });

    test('rejects missing identity instead of falling back to shared data', () => {
        expect(() => userDatabasePath('/tasklists', null)).toThrow('Authenticated user required');
        expect(() => userDatabaseUpdates({ '/tasklists/item': {} }, '')).toThrow('Authenticated user required');
    });

    test('scopes every path in a multi-location update', () => {
        expect(userDatabaseUpdates({
            '/tasklists/list-1': { title: 'Mine' },
            '/tasks/list-1/task-1': null,
        }, 'user-a')).toEqual({
            'users/user-a/tasklists/list-1': { title: 'Mine' },
            'users/user-a/tasks/list-1/task-1': null,
        });
    });

    test('stores uploads inside the owner namespace', () => {
        expect(userStoragePath('image.png', 'user-a')).toBe('users/user-a/image.png');
        expect(() => userStoragePath('image.png', null)).toThrow('Authenticated user required');
    });
});
