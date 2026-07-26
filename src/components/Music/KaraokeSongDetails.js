import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import DetailsPage from '../Site/DetailsPage';

import AddKaraokeSong from './AddKaraokeSong';

export default function KaraokeSongDetails() {

    //params
    const params = useParams();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });

    //alert
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showFailure
    } = useAlert();

    //modal
    const { status: showEdit, toggleStatus: toggleShowEdit } = useToggle();

    //fetch data
    const { data: song, loading } = useFetch(DB.MUSIC_KARAOKE_SONGS, '', params.id);

    const updateSong = async (updateSongID, updatedSong) => {
        try {
            const songID = params.id;
            updatedSong['modified'] = getCurrentDateAsJson();
            updateToFirebaseById(DB.MUSIC_KARAOKE_SONGS, songID, updatedSong);
        } catch (saveError) {
            showFailure(t('failed_to_save_music'));
            console.warn(saveError);
        }
    };

    return (
        <DetailsPage
            item={song}
            id={params.id}
            dbKey={DB.MUSIC_KARAOKE_SONGS}
            loading={loading}
            showEditButton={true}
            isEditOpen={showEdit}
            onToggleEdit={toggleShowEdit}
            title={song?.name}
            summary={`${t('description')}: ${song?.description || '-'}`}
            metaItems={[
                {
                    id: 1,
                    content: <><span className='detailspage-meta-label'>{t('created')}:</span> <span className='detailspage-meta-value'>{getJsonAsDateTimeString(song?.created, i18n.language)}</span></>
                },
                {
                    id: 2,
                    content: <><span className='detailspage-meta-label'>{t('created_by')}:</span> <span className='detailspage-meta-value'>{song?.createdBy || '-'}</span></>
                },
                {
                    id: 3,
                    content: <><span className='detailspage-meta-label'>{t('modified')}:</span> <span className='detailspage-meta-value'>{getJsonAsDateTimeString(song?.modified, i18n.language)}</span></>
                }
            ]}
            editModalTitle={t('modal_header_edit_karaoke_song')}
            editSection={<AddKaraokeSong onSave={updateSong} songID={params.id} onClose={toggleShowEdit} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages,
                alertColLg: 12,
            }}
        />
    );
}
