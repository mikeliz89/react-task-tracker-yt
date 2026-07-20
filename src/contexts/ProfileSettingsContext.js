import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { subscribeToFirebaseById } from '../datatier/datatier';
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

export function useProfileSettings() {
    return useContext(ProfileSettingsContext);
}

export function ProfileSettingsProvider({ children }) {
    const { currentUser } = useAuth();
    const [disableScrollToTopAnimation, setDisableScrollToTopAnimation] = useState(null);
    const [height, setHeight] = useState(null);

    useEffect(() => {
        if (!currentUser?.uid) {
            setDisableScrollToTopAnimation(null);
            setHeight(null);
            return;
        }

        const unsubscribe = subscribeToFirebaseById(DB.PROFILES, currentUser.uid, (snapshot) => {
            const data = snapshot.val();
            setDisableScrollToTopAnimation(parseBoolean(data?.disableScrollToTopAnimation));
            setHeight(data?.height ?? null);
        });

        return () => {
            unsubscribe();
        };
    }, [currentUser?.uid]);

    const value = useMemo(() => ({
        disableScrollToTopAnimation,
        height,
    }), [disableScrollToTopAnimation, height]);

    return (
        <ProfileSettingsContext.Provider value={value}>
            {children}
        </ProfileSettingsContext.Provider>
    );
}

ProfileSettingsProvider.propTypes = {
    children: PropTypes.node,
};
