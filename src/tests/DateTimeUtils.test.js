import { formatDate, getAgeFromBirthday } from '../utils/DateTimeUtils';

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

describe('getAgeFromBirthday', () => {
    test('returns null for empty birthday', () => {
        expect(getAgeFromBirthday('')).toBeNull();
    });

    test('returns null for invalid birthday', () => {
        expect(getAgeFromBirthday('not-a-date')).toBeNull();
    });

    test('calculates age when birthday has passed this year', () => {
        const now = new Date('2026-06-21T12:00:00.000Z');
        expect(getAgeFromBirthday('1990-04-10T00:00:00.000Z', now)).toBe(36);
    });

    test('calculates age when birthday is today', () => {
        const now = new Date('2026-06-21T12:00:00.000Z');
        expect(getAgeFromBirthday('1990-06-21T00:00:00.000Z', now)).toBe(36);
    });

    test('calculates age when birthday has not occurred yet this year', () => {
        const now = new Date('2026-06-21T12:00:00.000Z');
        expect(getAgeFromBirthday('1990-12-01T00:00:00.000Z', now)).toBe(35);
    });

    test('returns null for future birthday', () => {
        const now = new Date('2026-06-21T12:00:00.000Z');
        expect(getAgeFromBirthday('2030-01-01T00:00:00.000Z', now)).toBeNull();
    });
});
