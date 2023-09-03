import CenterWrapper from "../Site/CenterWrapper";
import Track from "./Track";
import { useTranslation } from 'react-i18next';
import * as Constants from '../../utils/Constants';

export default function Tracks({ tracks, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_DISC_GOLF, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });

    return (
        tracks != null && tracks.length > 0 ? (
            <>
                {
                    tracks.map((track) => (
                        <Track key={track.id} track={track} onDelete={onDelete} />
                    ))
                }
            </>
        )
            : (
                <>
                    <CenterWrapper>
                        {t('no_tracks_to_show')}
                    </CenterWrapper>
                </>
            )
    )
}