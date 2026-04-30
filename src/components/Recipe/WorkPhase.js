//states
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import ListRow from '../Site/ListRow';
import AddWorkPhase from './AddWorkPhase';

export default function WorkPhase({ dbUrl, translation, translationKeyPrefix, workPhase, recipeID, onDelete }) {

    //translation
    const { t } = useTranslation(translation, { keyPrefix: translationKeyPrefix });
    const [editable, setEditable] = useState(false);

    const updateWorkPhase = (recipeID, newWorkPhase) => {
        updateToFirebaseByIdAndSubId(dbUrl, recipeID, workPhase.id, newWorkPhase);
        setEditable(false);
    };

    return (
        <>
            <ListRow
                item={workPhase}
                dbKey={dbUrl}
                showStarRating={false}
                headerTitle={workPhase.name}
                showEditButton={true}
                editable={editable}
                setEditable={setEditable}
                showDeleteButton={true}
                onDelete={onDelete}
                deleteId={recipeID}
                deleteSubId={workPhase.id}
                modalTitle={t('edit_workphase')}
                modalBody={
                    <AddWorkPhase
                        dbUrl={dbUrl}
                        translation={translation}
                        translationKeyPrefix={translationKeyPrefix}
                        workPhaseID={workPhase.id}
                        recipeID={recipeID}
                        onSave={updateWorkPhase}
                        onClose={() => setEditable(false)}
                    />
                }
            >
                <div style={{ marginLeft: 16 }}>
                    {workPhase.estimatedLength ? workPhase.estimatedLength : 0} {t('in_minutes')}
                </div>
            </ListRow>
        </>
    );
}

WorkPhase.defaultProps = {
    dbUrl: '/none',
    translation: '',
}

WorkPhase.propTypes = {
    dbUrl: PropTypes.string,
    translation: PropTypes.string,
    recipeID: PropTypes.string,
    onDelete: PropTypes.func
}
