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
import AddMusic from './AddMusic';

export default function Music({ music, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //states
    const [editable, setEditable] = useState(false);

    const updateMusic = (updateMusicID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(Constants.DB_MUSIC, updateMusicID, object);
        setEditable(false);
    }

    const markHaveAtHome = () => {
        music["haveAtHome"] = true;
        onEdit(music);
    }

    const markNotHaveAtHome = () => {
        music["haveAtHome"] = false;
        onEdit(music);
    }

    return (
        <div className='listContainer'>
            <h5>
                <span>
                    {music.band} {music.band !== '' ? '-' : ''} {music.name} {music.publishYear > 0 ? '(' + music.publishYear + ')' : ''}
                </span>
                <RightWrapper>
                    <Icon name={Constants.ICON_EDIT} className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => editable ? setEditable(false) : setEditable(true)} />
                    <Icon className='deleteBtn'
                        name={Constants.ICON_DELETE}
                        color={Constants.COLOR_DELETEBUTTON} fontSize='1.2em' cursor='pointer'
                        onClick={() => {
                            if (window.confirm(t('delete_music_confirm_message'))) {
                                onDelete(music.id);
                            }
                        }} />
                </RightWrapper>
            </h5>
            {!editable &&
                <p>
                    {music.format > 0 ?
                        (<span> {
                            t('music_format_' + getMusicFormatNameByID(music.format))
                        }</span>) : ('')}
                </p>
            }
            {!editable &&
                <p>
                    {music.description}
                </p>
            }
            {!editable &&
                <p>
                    <Link className='btn btn-primary' to={`${Constants.NAVIGATION_MUSIC}/${music.id}`}>{t('view_details')}</Link>
                </p>
            }
            <StarRating starCount={music.stars} />

            {
                editable && <AddMusic
                    musicID={music.id}
                    onClose={() => setEditable(false)}
                    onSave={updateMusic}
                    showLabels={false} />
            }

            <p>
                {
                    music.haveAtHome &&
                    <span
                        onClick={() => { markNotHaveAtHome() }}
                        className='btn btn-success' style={{ margin: '5px' }}>
                        {t('have')}&nbsp;
                        <FaCheckSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                    </span>
                }
                {
                    !music.haveAtHome &&
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