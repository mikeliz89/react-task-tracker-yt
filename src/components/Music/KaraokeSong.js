import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import ListRow from '../Site/ListRow';

import AddKaraokeSong from './AddKaraokeSong';

export default function KaraokeSong({ item, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const [editable, setEditable] = useState(false);

    const updateSong = (updateSongID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.MUSIC_KARAOKE_SONGS, updateSongID, object);
        setEditable(false);
    }

    return (
        <ListRow
            item={item}
            dbKey={DB.MUSIC_KARAOKE_SONGS}
            headerProps={{
                title: item.name,
                titleTo: `${NAVIGATION.MUSIC_KARAOKE_SONG}/${item.id}`
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={item.id}
            section={<p>{item.description}</p>}
            modalProps={{
                modalTitle: t('modal_header_edit_karaoke_song') || 'Edit Karaoke Song',
                modalBody: (
                    <AddKaraokeSong
                        songID={item.id}
                        onClose={() => setEditable(false)}
                        onSave={updateSong}
                        showLabels={true}
                    />
                )
            }}
        />
    )
}
