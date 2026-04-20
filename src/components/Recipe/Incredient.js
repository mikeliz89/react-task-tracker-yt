import PropTypes from 'prop-types';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';

import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import RightWrapper from '../Site/RightWrapper';


import AddIncredient from './AddIncredient';
import ListRow from '../Site/ListRow';

export default function Incredient({ dbUrl, translation, translationKeyPrefix, incredient, recipeID, onDelete }) {

    const [editable, setEditable] = useState(false);

    const updateIncredient = (recipeID, newIncredient) => {
        updateToFirebaseByIdAndSubId(dbUrl, recipeID, incredient.id, newIncredient);
        setEditable(false);
    };

    return (
        <>
            <ListRow
                headerTitle={incredient.name}
                showEditButton={true}
                editable={editable}
                setEditable={setEditable}
                showDeleteButton={true}
                onDelete={onDelete}
                deleteId={recipeID}
                deleteSubId={incredient.id}
            >
                <div style={{ marginLeft: 16 }}>
                    {incredient.amount} {incredient.unit}
                </div>
            </ListRow>
            {editable && (
                <AddIncredient
                    translation={translation}
                    translationKeyPrefix={translationKeyPrefix}
                    dbUrl={dbUrl}
                    incredientID={incredient.id}
                    recipeID={recipeID}
                    onSave={updateIncredient}
                    onClose={() => setEditable(false)}
                />
            )}
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


