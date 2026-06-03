import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { getMusicFormatNameByID } from '../../utils/ListUtils';
import ListRow from '../Site/ListRow';

import AddRecord from './AddRecord';

export default function Record({  item, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const [editable, setEditable] = useState(false);

    const updateRecord = (updateRecordID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.MUSIC_RECORDS, updateRecordID, object);
        setEditable(false);
    }

    const recordTitle = `${item.band} ${item.band !== '' ? '-' : ''} ${item.name} ${item.publishYear > 0 ? `(${item.publishYear})` : ''}`.trim();

    return (
        <ListRow
            item={item}
            dbKey={DB.MUSIC_RECORDS}
            headerProps={{
                title: recordTitle,
                titleTo: `${NAVIGATION.MUSIC_RECORD}/${item.id}`
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={item.id}
            section={
                <>
                    <p>
                        {item.format > 0 ?
                            (<span> {
                                t('music_format_' + getMusicFormatNameByID(item.format))
                            }</span>) : ('')}
                    </p>
                    <p>
                        {item.description}
                    </p>
                </>
            }
            modalProps={{
                modalTitle: t('modal_header_edit_record') || 'Edit Record',
                modalBody: (
                    <AddRecord
                        recordID={item.id}
                        onClose={() => setEditable(false)}
                        onSave={updateRecord}
                        showLabels={true}
                    />
                )
            }}
            showCheckButton={true}
            checkButtonProps={{
                checked: !!item.haveAtHome,
                checkedText: t('have'),
                uncheckedText: t('have_not'),
                onCheck: () => { item["haveAtHome"] = true; onEdit(item); },
                onUncheck: () => { item["haveAtHome"] = false; onEdit(item); }
            }}
        />
    )
}



