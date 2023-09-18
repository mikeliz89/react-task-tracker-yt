import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import RightWrapper from '../Site/RightWrapper';
import { useState } from 'react';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import AddBand from './AddBand';

export default function Band({ band, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //states
    const [editable, setEditable] = useState(false);

    const updateBand = (updateBandID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(Constants.DB_MUSIC_BANDS, updateBandID, object);
        setEditable(false);
    }

    return (
        <div className='listContainer'>
            <h5>
                <span>
                    {band.name} {band.formingYear > 0 ? '(' + band.formingYear + ')' : ''}
                </span>
                <RightWrapper>
                    <Icon name={Constants.ICON_EDIT} className={Constants.CLASSNAME_EDITBTN}
                        style={{ color: Constants.COLOR_LIGHT_GRAY, cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => editable ? setEditable(false) : setEditable(true)} />
                    <Icon className={Constants.CLASSNAME_DELETEBTN}
                        name={Constants.ICON_DELETE}
                        color={Constants.COLOR_DELETEBUTTON} fontSize='1.2em' cursor='pointer'
                        onClick={() => {
                            if (window.confirm(t('delete_music_band_confirm_message'))) {
                                onDelete(band.id);
                            }
                        }} />
                </RightWrapper>
            </h5>
            {!editable &&
                <p>
                    {band.description}
                </p>
            }
            {!editable &&
                <p>
                    <Link className='btn btn-primary' to={`${Constants.NAVIGATION_MUSIC_BAND}/${band.id}`}>{t('view_details')}</Link>
                </p>
            }
            <StarRating starCount={band.stars} />

            {
                editable && <AddBand
                    bandID={band.id}
                    onClose={() => setEditable(false)}
                    onSave={updateBand}
                    showLabels={false} />
            }
        </div>
    )
}