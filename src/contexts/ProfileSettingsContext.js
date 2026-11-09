import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { subscribeToFirebaseById, updateToFirebaseById } from '../datatier/datatier';
import { DB } from '../utils/Constants';
import { useAuth } from './AuthContext';

const ProfileSettingsContext = createContext();

function parseBoolean(value) {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'true') {
            return true;
        }
        if (normalized === 'false') {
            return false;
        }
    }

    return null;
}

export const useProfileSettings = () => {
    return useContext(ProfileSettingsContext);
};

export const ProfileSettingsProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState({ name: null, height: null, disableScrollToTopAnimation: null });
    const [profileUserId, setProfileUserId] = useState(null);

    useEffect(() => {
        setProfile({ name: null, height: null, disableScrollToTopAnimation: null });
        setProfileUserId(null);

        if (!currentUser?.uid) {
            return;
        }

        const unsubscribe = subscribeToFirebaseById(DB.PROFILES, currentUser.uid, (snapshot) => {
            const data = snapshot.val();
            setProfile({
                name: data?.name ?? null,
                height: data?.height ?? null,
                disableScrollToTopAnimation: parseBoolean(data?.disableScrollToTopAnimation),
            });
            setProfileUserId(currentUser.uid);
        });

        return () => {
            unsubscribe();
        };
    }, [currentUser?.uid]);

    const saveProfile = useCallback(async (nextProfile) => {
        const uid = currentUser?.uid;
        if (!uid) {
            return;
        }

        await updateToFirebaseById(DB.PROFILES, uid, nextProfile);
        setProfile({
            name: nextProfile.name ?? null,
            height: nextProfile.height ?? null,
            disableScrollToTopAnimation: parseBoolean(nextProfile.disableScrollToTopAnimation),
        });
        setProfileUserId(uid);
    }, [currentUser?.uid]);

    const value = useMemo(() => ({
        ...(profileUserId === currentUser?.uid ? profile : { name: null, height: null, disableScrollToTopAnimation: null }),
        saveProfile,
    }), [profile, profileUserId, currentUser?.uid, saveProfile]);

    return (
        <ProfileSettingsContext.Provider value={value}>
            {children}
        </ProfileSettingsContext.Provider>
    );
}

ProfileSettingsProvider.propTypes = {
    children: PropTypes.node,
};
