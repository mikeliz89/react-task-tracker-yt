import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ProfileSettingsProvider, useProfileSettings } from '../contexts/ProfileSettingsContext';
import { DB } from '../utils/Constants';

const mockUseAuth = jest.fn();
const mockSubscribeToFirebaseById = jest.fn();
const mockUpdateToFirebaseById = jest.fn();

jest.mock('../contexts/AuthContext', () => ({
    useAuth: () => mockUseAuth(),
}));

jest.mock('../datatier/datatier', () => ({
    subscribeToFirebaseById: (...args) => mockSubscribeToFirebaseById(...args),
    updateToFirebaseById: (...args) => mockUpdateToFirebaseById(...args),
}));

function ProfileConsumer() {
    const { name, height, saveProfile } = useProfileSettings();

    return (
        <>
            <span data-testid="profile">{JSON.stringify({ name, height })}</span>
            <button onClick={() => saveProfile({ name: 'Updated', height: 181, disableScrollToTopAnimation: false })}>
                Save profile
            </button>
        </>
    );
}

function renderProvider() {
    return render(
        <ProfileSettingsProvider>
            <ProfileConsumer />
        </ProfileSettingsProvider>
    );
}

beforeEach(() => {
    mockUseAuth.mockReset();
    mockSubscribeToFirebaseById.mockReset();
    mockUpdateToFirebaseById.mockReset().mockResolvedValue();
});

test('loads the signed-in user profile into shared settings', async () => {
    let onProfile;
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'user-a' } });
    mockSubscribeToFirebaseById.mockImplementation((path, uid, callback) => {
        onProfile = callback;
        return jest.fn();
    });

    renderProvider();
    act(() => onProfile({ val: () => ({ name: 'Ada', height: 172, disableScrollToTopAnimation: true }) }));

    await waitFor(() => expect(screen.getByTestId('profile')).toHaveTextContent('{"name":"Ada","height":172}'));
    expect(mockSubscribeToFirebaseById).toHaveBeenCalledTimes(1);
});

test('clears stale profile data when the signed-in user changes or logs out', async () => {
    const unsubscribeA = jest.fn();
    const unsubscribeB = jest.fn();
    const profileCallbacks = {};
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'user-a' } });
    mockSubscribeToFirebaseById.mockImplementation((path, uid, callback) => {
        profileCallbacks[uid] = callback;
        return uid === 'user-a' ? unsubscribeA : unsubscribeB;
    });

    const view = renderProvider();
    act(() => profileCallbacks['user-a']({ val: () => ({ name: 'Ada', height: 172 }) }));
    await waitFor(() => expect(screen.getByTestId('profile')).toHaveTextContent('{"name":"Ada","height":172}'));

    mockUseAuth.mockReturnValue({ currentUser: { uid: 'user-b' } });
    view.rerender(<ProfileSettingsProvider><ProfileConsumer /></ProfileSettingsProvider>);
    await waitFor(() => expect(screen.getByTestId('profile')).toHaveTextContent('{"name":null,"height":null}'));
    expect(unsubscribeA).toHaveBeenCalledTimes(1);

    act(() => profileCallbacks['user-b']({ val: () => ({ name: 'Bea', height: 181 }) }));
    await waitFor(() => expect(screen.getByTestId('profile')).toHaveTextContent('{"name":"Bea","height":181}'));

    mockUseAuth.mockReturnValue({ currentUser: null });
    view.rerender(<ProfileSettingsProvider><ProfileConsumer /></ProfileSettingsProvider>);

    await waitFor(() => expect(screen.getByTestId('profile')).toHaveTextContent('{"name":null,"height":null}'));
    expect(unsubscribeB).toHaveBeenCalledTimes(1);
});

test('updates the shared height after saving a profile', async () => {
    mockUseAuth.mockReturnValue({ currentUser: { uid: 'user-a' } });
    mockSubscribeToFirebaseById.mockReturnValue(jest.fn());

    renderProvider();
    fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));

    await waitFor(() => expect(screen.getByTestId('profile')).toHaveTextContent('{"name":"Updated","height":181}'));
    expect(mockUpdateToFirebaseById).toHaveBeenCalledWith(DB.PROFILES, 'user-a', expect.objectContaining({ name: 'Updated', height: 181 }));
});
