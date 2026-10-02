const fs = require('fs');

const FALLBACK_OWNER_UID = '2R6C4xudIrgZGtSQvwBYW4sbfZH2';

const USER_KEYED_SECTIONS = new Set(['profiles', 'weighthistory', 'wellbeing-goals', 'housing']);
const CHILD_SECTIONS = {
    'backpacking-gear-comments': 'backpacking-gear',
    'backpacking-gear-images': 'backpacking-gear',
    'backpacking-gear-links': 'backpacking-gear',
    'car-fueling': 'cars',
    'car-info': 'cars',
    'car-maintenance': 'cars',
    'disc-golf-round-players': 'disc-golf-rounds',
    'disc-golf-track-holes': 'disc-golf-tracks',
    'drink-comments': 'drinks',
    'drink-garnishes': 'drinks',
    'drink-images': 'drinks',
    'drink-incredients': 'drinks',
    'drink-links': 'drinks',
    'drink-workphases': 'drinks',
    'drinkhistory': 'drinks',
    'drinkingproduct-comments': 'drinkingproducts',
    'drinkingproduct-links': 'drinkingproducts',
    'drinkingproduct-images': 'drinkingproducts',
    'exercise-comments': 'exercises',
    'exercise-images': 'exercises',
    'exercise-links': 'exercises',
    'exercise-parts': 'exercises',
    'exercise-movement-comments': 'exercise-movements',
    'exercise-movement-images': 'exercise-movements',
    'exercise-movement-links': 'exercise-movements',
    'fooditem-comments': 'fooditems',
    'fooditem-images': 'fooditems',
    'fooditem-links': 'fooditems',
    'game-comments': 'games',
    'game-images': 'games',
    'game-links': 'games',
    'board-game-comments': 'board-games',
    'board-game-images': 'board-games',
    'board-game-links': 'board-games',
    'movie-comments': 'movies',
    'movie-images': 'movies',
    'movie-links': 'movies',
    'music-comments': 'music-records',
    'music-images': 'music-records',
    'music-links': 'music-records',
    'music-band-events': 'music-bands',
    'music-band-comments': 'music-bands',
    'music-band-images': 'music-bands',
    'music-band-links': 'music-bands',
    'music-event-bands': 'music-events',
    'music-event-comments': 'music-events',
    'music-event-images': 'music-events',
    'music-event-links': 'music-events',
    'music-karaoke-song-lyrics': 'music-karaoke-songs',
    'person-comments': 'people',
    'person-images': 'people',
    'person-links': 'people',
    'recipe-comments': 'recipes',
    'recipe-images': 'recipes',
    'recipe-incredients': 'recipes',
    'recipe-links': 'recipes',
    'recipe-workphases': 'recipes',
    'recipehistory': 'recipes',
    'task-comments': 'task-items',
    'task-images': 'task-items',
    'task-links': 'task-items',
    'tasklist-comments': 'tasklists',
    'tasklist-images': 'tasklists',
    'tasklist-links': 'tasklists',
    'tasklist-archive-tasks': 'tasklist-archive',
    'tasks': 'tasklists',
};

function migrateDatabase(source, emailToUid, ownerOverrides = {}) {
    const users = {};
    const unresolved = [];
    let fallbackCount = 0;
    const ownerByRecord = {};
    const normalizedEmails = Object.fromEntries(
        Object.entries(emailToUid).map(([email, uid]) => [email.trim().toLowerCase(), uid])
    );

    function put(section, id, value, uid) {
        if (!users[uid]) users[uid] = {};
        if (!users[uid][section]) users[uid][section] = {};
        users[uid][section][id] = value;
        if (!ownerByRecord[section]) ownerByRecord[section] = {};
        ownerByRecord[section][id] = uid;
        if (section === 'tasks' && value && typeof value === 'object') {
            if (!ownerByRecord['task-items']) ownerByRecord['task-items'] = {};
            for (const taskId of Object.keys(value)) {
                ownerByRecord['task-items'][taskId] = uid;
            }
        }
    }

    for (const [section, records] of Object.entries(source)) {
        if (CHILD_SECTIONS[section] || !records || typeof records !== 'object') continue;
        for (const [id, value] of Object.entries(records)) {
            if (!value || typeof value !== 'object') {
                unresolved.push({ section, id, reason: 'invalid record' });
                continue;
            }
            const inferredUid = ownerOverrides[section]?.[id] || (USER_KEYED_SECTIONS.has(section)
                ? id
                : value.ownerUid || value.userId || normalizedEmails[String(value.createdBy || '').trim().toLowerCase()]);
            const uid = inferredUid || FALLBACK_OWNER_UID;
            if (!inferredUid) fallbackCount++;
            put(section, id, value, uid);
        }
    }

    const pending = Object.entries(source).filter(([section]) => CHILD_SECTIONS[section]);
    while (pending.length) {
        let progressed = false;
        for (let index = pending.length - 1; index >= 0; index--) {
            const [section, records] = pending[index];
            const parentSection = CHILD_SECTIONS[section];
            if (!ownerByRecord[parentSection] && pending.some(([name]) =>
                name === parentSection || (parentSection === 'task-items' && name === 'tasks'))) continue;
            for (const [id, value] of Object.entries(records || {})) {
                const inferredUid = ownerByRecord[parentSection]?.[id];
                const uid = inferredUid || FALLBACK_OWNER_UID;
                if (!inferredUid) fallbackCount++;
                put(section, id, value, uid);
            }
            pending.splice(index, 1);
            progressed = true;
        }
        if (!progressed) break;
    }
    for (const [section, records] of pending) {
        for (const id of Object.keys(records || {})) {
            put(section, id, records[id], FALLBACK_OWNER_UID);
            fallbackCount++;
        }
    }
    return { users, unresolved, fallbackCount };
}

function createImportPayload(result) {
    return { users: result.users };
}

if (require.main === module) {
    const [inputPath, uidMapPath, outputPath, reportPath, overridesPath] = process.argv.slice(2);
    if (!inputPath || !uidMapPath || !outputPath || !reportPath) {
        console.error('Usage: node scripts/migrate-user-data.js <export.json> <email-to-uid.json> <output.json> <unresolved.json> [owner-overrides.json]');
        process.exitCode = 1;
    } else {
        const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
        const uidMap = JSON.parse(fs.readFileSync(uidMapPath, 'utf8'));
        const overrides = overridesPath ? JSON.parse(fs.readFileSync(overridesPath, 'utf8')) : {};
        const result = migrateDatabase(input, uidMap, overrides);
        fs.writeFileSync(outputPath, JSON.stringify(createImportPayload(result), null, 2));
        fs.writeFileSync(reportPath, JSON.stringify(result.unresolved, null, 2));
        console.log(`Prepared ${Object.keys(result.users).length} user namespaces; ${result.fallbackCount} records assigned to the fallback owner; ${result.unresolved.length} invalid records need review.`);
        if (result.unresolved.length) process.exitCode = 2;
    }
}

module.exports = { migrateDatabase, createImportPayload };
