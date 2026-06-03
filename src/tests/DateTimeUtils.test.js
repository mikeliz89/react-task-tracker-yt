import { formatDate } from '../utils/DateTimeUtils';

describe('formatDate', () => {
    test('formats a valid date to dd.mm.yyyy', () => {
        expect(formatDate('2024-01-05T12:30:00')).toBe('05.01.2024');
    });

    test('returns empty string for empty input', () => {
        expect(formatDate('')).toBe('');
    });

    test('returns original value for invalid date input', () => {
        expect(formatDate('not-a-date')).toBe('not-a-date');
    });
});
