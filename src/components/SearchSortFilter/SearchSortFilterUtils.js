export const filterCheckText = (newList, key, comparableString) => {
    const needle = String(comparableString).toLowerCase();
    return newList.filter(x =>
        x[key] != null && String(x[key]).toLowerCase().includes(needle)
    );
};

export const filterCheckAnyText = (newList, keys, comparableString) => {
    const needle = String(comparableString).toLowerCase();
    return newList.filter(x =>
        keys.some(key => x[key] != null && String(x[key]).toLowerCase().includes(needle))
    );
};

export const filterCheckTrue = (newList, key) => {
    return newList.filter(x => x[key] === true);
};

export const filterCheckFalse = (newList, key) => {
    return newList.filter(x => x[key] === false || !x[key]);
};

export const filterCheckIntMoreThanZero = (newList, key) => {
    return newList.filter(x => x[key] !== undefined && x[key] > 0);
};

export const filterCheckIntZero = (newList, key) => {
    return newList.filter(x => x[key] === undefined || x[key] === 0);
};

export const sortByText = (newList, key) => {
    return [...newList].sort((a, b) => {
        return String(a[key]).toLowerCase() > String(b[key]).toLowerCase() ? 1 : -1;
    });
};

export const sortByDate = (newList, key) => {
    return [...newList].sort(
        (a, b) => new Date(a[key]).setHours(0, 0, 0, 0) - new Date(b[key]).setHours(0, 0, 0, 0)
    );
};

export const sortByInt = (newList, key) => {
    return [...newList].sort((a, b) => {
        const aCount = a[key] === undefined ? 0 : a[key];
        const bCount = b[key] === undefined ? 0 : b[key];
        return aCount - bCount;
    });
};
