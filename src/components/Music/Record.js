//states

import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { getMusicFormatNameByID } from '../../utils/ListUtils';
import CheckButton from '../Buttons/CheckButton';
import NavButton from '../Buttons/NavButton';
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

    return (
        <ListRow
            headerLeft={
                <span>
                    <NavButton to={`${NAVIGATION.MUSIC_RECORD}/${record.id}`} className="">
                        {record.band} {record.band !== '' ? '-' : ''} {record.name} {record.publishYear > 0 ? '(' + record.publishYear + ')' : ''}
                    </NavButton>
                </span>
            }
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={record.id}
            starCount={record.stars}
        >
            {!editable &&
                <p>
                    {record.format > 0 ?
                        (<span> {
                            t('music_format_' + getMusicFormatNameByID(record.format))
                        }</span>) : ('')}
                </p>
            }
            {!editable &&
                <p>
                    {record.description}
                </p>
            }

            {
                editable && <AddRecord
                    recordID={record.id}
                    onClose={() => setEditable(false)}
                    onSave={updateRecord}
                    showLabels={false} />
            }

            <p>
                <CheckButton
                    checked={record.haveAtHome}
                    checkedText={t('have')}
                    uncheckedText={t('have_not')}
                    onCheck={markHaveAtHome}
                    onUncheck={markNotHaveAtHome}
                    style={{ margin: '5px' }}
                />
            </p>
        </ListRow>
    )
}



