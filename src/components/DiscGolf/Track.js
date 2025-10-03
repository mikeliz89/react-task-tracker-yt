import { useTranslation } from "react-i18next";
import * as Constants from '../../utils/Constants';
import { Link } from "react-router-dom";

export default function Track({ track }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });

    return (
        <>
            <div className='listContainer'>
                <h5>
                    {track.trackName}
                </h5>
                <h6>{t('track_city')}: {track.trackCity}</h6>
                <p>{track.description}</p>
                
                <Link className='btn btn-primary' to={`${Constants.NAVIGATION_DISC_GOLF_TRACK}/${track.id}`}>{t('view_details')}</Link>
            </div>
        </>
    )
}