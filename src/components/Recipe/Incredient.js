import PropTypes from 'prop-types';
import { useState } from 'react';
import { TRANSLATION, DB } from '../../utils/Constants';
import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { useTranslation } from 'react-i18next';

import AddIncredient from './AddIncredient';
import ListRow from '../Site/ListRow';

export default function Incredient({ dbUrl, translation, translationKeyPrefix, incredient, recipeID, onDelete }) {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });
    const [editable, setEditable] = useState(false);

    const updateIncredient = (recipeID, newIncredient) => {
        updateToFirebaseByIdAndSubId(dbUrl, recipeID, incredient.id, newIncredient);
        setEditable(false);
    };

    return (
        <>
            <ListRow
                item={incredient}
                dbKey={DB.RECIPE_INCREDIENTS}
                headerTitle={incredient.name}
                showEditButton={true}
                editable={editable}
                setEditable={setEditable}
                showStarRating={false}
                showDeleteButton={true}
                onDelete={onDelete}
                deleteId={recipeID}
                deleteSubId={incredient.id}
                modalTitle={t('edit_incredient')}
                modalBody={
                    <AddIncredient
                        translation={translation}
                        translationKeyPrefix={translationKeyPrefix}
                        dbUrl={dbUrl}
                        incredientID={incredient.id}
                        recipeID={recipeID}
                        onSave={updateIncredient}
                        onClose={() => setEditable(false)}
                    />
                }
            >
                <div style={{ marginLeft: 16 }}>
                    {incredient.amount} {incredient.unit}
                </div>
            </ListRow>
        </>
    );
}

Incredient.defaultProps = {
    dbUrl: '/none',
    translation: '',
}

Incredient.propTypes = {
    dbUrl: PropTypes.string,
    translation: PropTypes.string,
    recipeID: PropTypes.string,
    onDelete: PropTypes.func
}


