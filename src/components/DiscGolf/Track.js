import { useTranslation } from "react-i18next";

import { TRANSLATION, NAVIGATION, DB } from '../../utils/Constants';
import ListRow from '../Site/ListRow';

export default function Track({ track }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DISC_GOLF });

    return (
        <ListRow
            item={track}
            dbKey={DB.DISC_GOLF_TRACK}
            headerProps={{
                title: track.trackName,
                titleTo: `${NAVIGATION.DISC_GOLF_TRACK}/${track.id}`
            }}
            section={
                <>
                    <h6>{t('track_city')}: {track.trackCity}</h6>
                    <p>{track.description}</p>
                </>
            }
        />
    )
}



