import Track from "./Track";
import { useTranslation } from 'react-i18next';
import * as Constants from '../../utils/Constants';

export default function Tracks({ tracks, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_DISC_GOLF, { keyPrefix: Constants.TRANSLATION_DISC_GOLF });

    return (
        <>
            {
                tracks.map((track) => (
                    <Track key={track.id} track={track} onDelete={onDelete} />
                ))
            }
        </>
    )
}