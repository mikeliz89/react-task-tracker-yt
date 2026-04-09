import { useState } from 'react';

import { useTranslation } from "react-i18next";

import { TRANSLATION, NAVIGATION } from '../../utils/Constants';
import CheckButton from '../Buttons/CheckButton';
import NavButton from '../Buttons/NavButton';
import ListRow from '../Site/ListRow';

export default function Track({ track }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DISC_GOLF });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //local selection
    const [checked, setChecked] = useState(false);

    return (
        <ListRow
            headerLeft={
                <NavButton to={`${NAVIGATION.DISC_GOLF_TRACK}/${track.id}`} className="">
                    {track.trackName}
                </NavButton>
            }
        >
            <h6>{t('track_city')}: {track.trackCity}</h6>
            <p>{track.description}</p>
        </ListRow>
    )
}



