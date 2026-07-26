import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import ListRow from '../Site/ListRow';

import AddKaraokeLyricRow from './AddKaraokeLyricRow';

export default function KaraokeLyricRow({ lyricRow, songID, onDelete }) {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const [editable, setEditable] = useState(false);

    const updateLyricRow = (updateSongID, newLyricRow) => {
        updateToFirebaseByIdAndSubId(DB.MUSIC_KARAOKE_SONG_LYRICS, updateSongID, lyricRow.id, newLyricRow);
        setEditable(false);
    };

    return (
        <ListRow
            item={lyricRow}
            dbKey={DB.MUSIC_KARAOKE_SONG_LYRICS}
            showStarRating={false}
            showSetStarRating={false}
            headerProps={{
                title: `${lyricRow.timestamp || '0:00'} ${lyricRow.lyric || ''}`.trim()
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={songID}
            deleteSubId={lyricRow.id}
            modalProps={{
                modalTitle: t('modal_header_edit_karaoke_lyric_row'),
                modalBody: (
                    <AddKaraokeLyricRow
                        lyricRowID={lyricRow.id}
                        songID={songID}
                        onSave={updateLyricRow}
                        onClose={() => setEditable(false)}
                    />
                )
            }}
        />
    );
}

KaraokeLyricRow.propTypes = {
    lyricRow: PropTypes.object.isRequired,
    songID: PropTypes.string,
    onDelete: PropTypes.func,
};
