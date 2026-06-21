import {
    filterCheckAnyText,
    filterCheckFalse,
    filterCheckIntMoreThanZero,
    filterCheckIntZero,
    filterCheckText,
    filterCheckTrue,
    sortByDate,
    sortByInt,
    sortByText
} from '../components/SearchSortFilter/SearchSortFilterUtils';

describe('SearchSortFilterUtils', () => {
    test('sortByText sorts alphabetically case-insensitive', () => {
        const list = [{ name: 'beta' }, { name: 'Alpha' }, { name: 'charlie' }];

        const result = sortByText(list, 'name');

        expect(result.map(x => x.name)).toEqual(['Alpha', 'beta', 'charlie']);
    });

    test('sortByDate sorts by date ignoring time of day', () => {
        const list = [
            { created: '2024-01-01T23:59:59.000Z' },
            { created: '2023-12-31T00:00:00.000Z' },
            { created: '2024-01-01T00:00:00.000Z' },
        ];

        const result = sortByDate(list, 'created');

        expect(result[0].created).toBe('2023-12-31T00:00:00.000Z');
        expect([result[1].created, result[2].created].sort()).toEqual([
            '2024-01-01T00:00:00.000Z',
            '2024-01-01T23:59:59.000Z'
        ]);
    });

    test('sortByInt treats undefined as zero', () => {
        const list = [{ stars: 3 }, {}, { stars: 1 }];

        const result = sortByInt(list, 'stars');

        expect(result).toEqual([{}, { stars: 1 }, { stars: 3 }]);
    });

    test('filterCheckText filters by one text field', () => {
        const list = [{ name: 'Alpha' }, { name: 'Beta' }, { name: 'Gamma' }];

        const result = filterCheckText(list, 'name', 'aLp');

        expect(result).toEqual([{ name: 'Alpha' }]);
    });

    test('filterCheckAnyText matches any provided field', () => {
        const list = [
            { name: 'Alpha', band: 'X' },
            { name: 'Beta', band: 'Metal Group' },
            { name: 'Gamma', band: 'Y' }
        ];

        const result = filterCheckAnyText(list, ['name', 'band'], 'metal');

        expect(result).toEqual([{ name: 'Beta', band: 'Metal Group' }]);
    });

    test('filterCheckTrue returns items where key is true', () => {
        const list = [{ haveAtHome: true }, { haveAtHome: false }, {}];

        const result = filterCheckTrue(list, 'haveAtHome');

        expect(result).toEqual([{ haveAtHome: true }]);
    });

    test('filterCheckFalse returns false and missing values', () => {
        const list = [{ seenLive: true }, { seenLive: false }, {}];

        const result = filterCheckFalse(list, 'seenLive');

        expect(result).toEqual([{ seenLive: false }, {}]);
    });

    test('filterCheckIntMoreThanZero returns only positive numbers', () => {
        const list = [{ stars: 2 }, { stars: 0 }, {}, { stars: -1 }];

        const result = filterCheckIntMoreThanZero(list, 'stars');

        expect(result).toEqual([{ stars: 2 }]);
    });

    test('filterCheckIntZero returns zero and undefined values', () => {
        const list = [{ stars: 2 }, { stars: 0 }, {}, { stars: -1 }];

        const result = filterCheckIntZero(list, 'stars');

        expect(result).toEqual([{ stars: 0 }, {}]);
    });
});
