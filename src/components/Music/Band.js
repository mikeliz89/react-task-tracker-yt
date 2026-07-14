//states
import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import ListRow from '../Site/ListRow';
import AddBand from './AddBand';

export default function Band({ item, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const [editable, setEditable] = useState(false);

    const updateBand = (updateBandID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.MUSIC_BANDS, updateBandID, object);
        setEditable(false);
    }

    const bandTitle = `${item.name} ${item.formingYear > 0 ? `(${item.formingYear})` : ''}`.trim();
    const hasSeenLive = item.seenLive === true || item.haveSeenLive === true;

    return (
        <ListRow
            item={item}
            dbKey={DB.MUSIC_BANDS}
            headerProps={{
                title: bandTitle,
                titleTo: `${NAVIGATION.MUSIC_BAND}/${item.id}`
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={item.id}
            section={<p>{item.description}</p>}
            modalProps={{
                modalTitle: t('modal_header_edit_band') || 'Edit Band',
                modalBody: (
                    <AddBand
                        bandID={item.id}
                        onClose={() => setEditable(false)}
                        onSave={updateBand}
                        showLabels={true}
                    />
                )
            }}
            showCheckButton={true}
            checkButtonProps={{
                checked: hasSeenLive,
                checkedText: t('show_only_seen_live'),
                uncheckedText: t('show_only_not_seen_live'),
                onCheck: () => {
                    item["seenLive"] = true;
                    item["haveSeenLive"] = true;
                    onEdit(item);
                },
                onUncheck: () => {
                    item["seenLive"] = false;
                    item["haveSeenLive"] = false;
                    onEdit(item);
                },
            }}
        />
    )
}



