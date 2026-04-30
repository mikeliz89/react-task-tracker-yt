//states

import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { getMusicFormatNameByID } from '../../utils/ListUtils';
import CheckButton from '../Buttons/CheckButton';
import ListRow from '../Site/ListRow';

import AddRecord from './AddRecord';

export default function Record({ record, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const [editable, setEditable] = useState(false);

    const updateRecord = (updateRecordID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.MUSIC_RECORDS, updateRecordID, object);
        setEditable(false);
    }

    const markHaveAtHome = () => {
        record["haveAtHome"] = true;
        onEdit(record);
    }

    const markNotHaveAtHome = () => {
        record["haveAtHome"] = false;
        onEdit(record);
    }

    const recordTitle = `${record.band} ${record.band !== '' ? '-' : ''} ${record.name} ${record.publishYear > 0 ? `(${record.publishYear})` : ''}`.trim();

    return (
        <ListRow
            item={record}
            dbKey={DB.MUSIC_RECORDS}
            headerTitle={recordTitle}
            headerTitleTo={`${NAVIGATION.MUSIC_RECORD}/${record.id}`}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={record.id}
            section={
                <>
                    <p>
                        {record.format > 0 ?
                            (<span> {
                                t('music_format_' + getMusicFormatNameByID(record.format))
                            }</span>) : ('')}
                    </p>
                    <p>
                        {record.description}
                    </p>
                </>
            }
            modalTitle={t('modal_header_edit_record') || 'Edit Record'}
            modalBody={
                <AddRecord
                    recordID={record.id}
                    onClose={() => setEditable(false)}
                    onSave={updateRecord}
                    showLabels={true}
                />
            }
        >
            <CheckButton
                checked={record.haveAtHome}
                checkedText={t('have')}
                uncheckedText={t('have_not')}
                onCheck={markHaveAtHome}
                onUncheck={markNotHaveAtHome}
                style={{ margin: '5px' }}
            />
        </ListRow>
    )
}



