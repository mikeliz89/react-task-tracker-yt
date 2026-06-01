import { useTranslation } from "react-i18next";

import { TRANSLATION, NAVIGATION, DB } from '../../utils/Constants';
import ListRow from '../Site/ListRow';

export default function Track({ item }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DISC_GOLF });

    return (
        <ListRow
            item={item}
            dbKey={DB.DISC_GOLF_TRACK}
            headerProps={{
                title: item.trackName,
                titleTo: `${NAVIGATION.DISC_GOLF_TRACK}/${item.id}`
            }}
            section={
                <>
                    <h6>{t('track_city')}: {item.trackCity}</h6>
                    <p>{item.description}</p>
                </>
            }
        />
    )
}



