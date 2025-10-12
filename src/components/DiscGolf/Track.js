import { useTranslation } from "react-i18next";
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import { Link } from "react-router-dom";

export default function Track({ track }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DISC_GOLF });

    return (
        <>
            <div className='listContainer'>
                <h5>
                    {track.trackName}
                </h5>
                <h6>{t('track_city')}: {track.trackCity}</h6>
                <p>{track.description}</p>
                
                <Link className='btn btn-primary' to={`${NAVIGATION.DISC_GOLF_TRACK}/${track.id}`}>{t('view_details')}</Link>
            </div>
        </>
    )
}