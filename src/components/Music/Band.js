


//states

import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import NavButton from '../Buttons/NavButton';
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

    return (
        <ListRow
            headerLeft={
                <span>
                    <NavButton to={`${NAVIGATION.MUSIC_BAND}/${band.id}`} className="">
                        {band.name} {band.formingYear > 0 ? '(' + band.formingYear + ')' : ''}
                    </NavButton>
                </span>
            }
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={band.id}
            starCount={band.stars}
        >
            {!editable &&
                <p>
                    {band.description}
                </p>
            }

            {
                editable && <AddBand
                    bandID={band.id}
                    onClose={() => setEditable(false)}
                    onSave={updateBand}
                    showLabels={false} />
            }
        </ListRow>
    )
}



