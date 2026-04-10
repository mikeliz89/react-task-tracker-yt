import { useTranslation } from "react-i18next";

import { TRANSLATION, NAVIGATION } from '../../utils/Constants';
import ListRow from '../Site/ListRow';

export default function Track({ track }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DISC_GOLF });

    return (
        <ListRow
            headerTitle={track.trackName}
            headerTitleTo={`${NAVIGATION.DISC_GOLF_TRACK}/${track.id}`}
        >
            <h6>{t('track_city')}: {track.trackCity}</h6>
            <p>{track.description}</p>
        </ListRow>
    )
}



