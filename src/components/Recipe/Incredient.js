import PropTypes from 'prop-types';
import { useState } from 'react';
import { TRANSLATION, DB } from '../../utils/Constants';
import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import { useTranslation } from 'react-i18next';

import AddIncredient from './AddIncredient';
import ListRow from '../Site/ListRow';

export default function Incredient({ dbUrl, translation, translationKeyPrefix, item, recipeID, onDelete }) {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });
    const [editable, setEditable] = useState(false);

    const updateIncredient = (recipeID, newIncredient) => {
        updateToFirebaseByIdAndSubId(dbUrl, recipeID, item.id, newIncredient);
        setEditable(false);
    };

    return (
        <>
            <ListRow
                item={item}
                dbKey={DB.RECIPE_INCREDIENTS}
                headerProps={{
                    title: item.name
                }}
                showEditButton={true}
                editable={editable}
                setEditable={setEditable}
                showStarRating={false}
                showSetStarRating={false}
                showDeleteButton={true}
                onDelete={onDelete}
                deleteId={recipeID}
                deleteSubId={item.id}
                modalProps={{
                    modalTitle: t('edit_incredient'),
                    modalBody: (
                        <AddIncredient
                            translation={translation}
                            translationKeyPrefix={translationKeyPrefix}
                            dbUrl={dbUrl}
                            incredientID={item.id}
                            recipeID={recipeID}
                            onSave={updateIncredient}
                            onClose={() => setEditable(false)}
                        />
                    )
                }}
                section={
                    <div style={{ marginLeft: 16 }}>
                        {item.amount} {item.unit}
                    </div>
                }
            />
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


