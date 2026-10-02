export const userDatabasePath = (path, uid) => {
    if (!uid) {
        throw new Error('Authenticated user required');
    }

    const relativePath = String(path || '').replace(/^\/+/, '');
    return relativePath ? `users/${uid}/${relativePath}` : `users/${uid}`;
};

export const userDatabaseUpdates = (updates, uid) => {
    if (!uid) {
        throw new Error('Authenticated user required');
    }

    return Object.fromEntries(
        Object.entries(updates).map(([path, value]) => [userDatabasePath(path, uid), value])
    );
};

export const userStoragePath = (path, uid) => userDatabasePath(path, uid);
