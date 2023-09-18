import { useTranslation } from 'react-i18next';
import { FaCheckSquare } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import { getMusicFormatNameByID } from '../../utils/ListUtils';
import RightWrapper from '../Site/RightWrapper';
import { useState } from 'react';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import AddRecord from './AddRecord';

export default function Record({ record, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //states
    const [editable, setEditable] = useState(false);

    const updateRecord = (updateRecordID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(Constants.DB_MUSIC_RECORDS, updateRecordID, object);
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
        <div className='listContainer'>
            <h5>
                <span>
                    {record.band} {record.band !== '' ? '-' : ''} {record.name} {record.publishYear > 0 ? '(' + record.publishYear + ')' : ''}
                </span>
                <RightWrapper>
                    <Icon name={Constants.ICON_EDIT} className={Constants.CLASSNAME_EDITBTN}
                        style={{ color: Constants.COLOR_LIGHT_GRAY, cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => editable ? setEditable(false) : setEditable(true)} />
                    <Icon className={Constants.CLASSNAME_DELETEBTN}
                        name={Constants.ICON_DELETE}
                        color={Constants.COLOR_DELETEBUTTON} fontSize='1.2em' cursor='pointer'
                        onClick={() => {
                            if (window.confirm(t('delete_music_confirm_message'))) {
                                onDelete(record.id);
                            }
                        }} />
                </RightWrapper>
            </h5>
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
            {!editable &&
                <p>
                    <Link className='btn btn-primary' to={`${Constants.NAVIGATION_MUSIC_RECORD}/${record.id}`}>{t('view_details')}</Link>
                </p>
            }
            <StarRating starCount={record.stars} />

            {
                editable && <AddRecord
                    recordID={record.id}
                    onClose={() => setEditable(false)}
                    onSave={updateRecord}
                    showLabels={false} />
            }

            <p>
                {
                    record.haveAtHome &&
                    <span
                        onClick={() => { markNotHaveAtHome() }}
                        className='btn btn-success' style={{ margin: '5px' }}>
                        {t('have')}&nbsp;
                        <FaCheckSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                    </span>
                }
                {
                    !record.haveAtHome &&
                    <span
                        onClick={() => { markHaveAtHome() }}
                        className='btn btn-danger' style={{ margin: '5px' }}>
                        {t('have_not')}&nbsp;
                        <FaCheckSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                    </span>
                }
            </p>
        </div>
    )
}