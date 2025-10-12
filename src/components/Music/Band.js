import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import * as Constants from '../../utils/Constants';
import RightWrapper from '../Site/RightWrapper';
import { useState } from 'react';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import AddBand from './AddBand';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';

export default function Band({ band, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_MUSIC });

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
                    <EditButton
                        editable={editable}
                        setEditable={setEditable}
                    />
                    <DeleteButton
                        onDelete={onDelete}
                        id={band.id}
                    />
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