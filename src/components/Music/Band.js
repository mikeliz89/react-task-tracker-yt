//states
import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import ListRow from '../Site/ListRow';
import AddBand from './AddBand';

export default function Band({ band, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const [editable, setEditable] = useState(false);

    const updateBand = (updateBandID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.MUSIC_BANDS, updateBandID, object);
        setEditable(false);
    }

    const bandTitle = `${band.name} ${band.formingYear > 0 ? `(${band.formingYear})` : ''}`.trim();

    return (
        <ListRow
            headerTitle={bandTitle}
            headerTitleTo={`${NAVIGATION.MUSIC_BAND}/${band.id}`}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={band.id}
            starCount={band.stars}
            section={<p>{band.description}</p>}
            modalTitle={t('modal_header_edit_band') || 'Edit Band'}
            modalBody={
                <AddBand
                    bandID={band.id}
                    onClose={() => setEditable(false)}
                    onSave={updateBand}
                    showLabels={true}
                />
            }
        />
    )
}



