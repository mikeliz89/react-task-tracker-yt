import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import AddWorkPhase from './AddWorkPhase';
import PropTypes from 'prop-types';
import { updateToFirebaseByIdAndSubId } from '../../datatier/datatier';
import RightWrapper from '../Site/RightWrapper';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';

export default function WorkPhase({ dbUrl, translation, translationKeyPrefix, workPhase, recipeID, onDelete }) {

    //translation
    const { t } = useTranslation(translation, { keyPrefix: translationKeyPrefix });

    //states
    const [editable, setEditable] = useState(false);

    const updateWorkPhase = (recipeID, newWorkPhase) => {
        updateToFirebaseByIdAndSubId(dbUrl, recipeID, workPhase.id, newWorkPhase);
        //close
        setEditable(false);
    }

    return (
        <div className='listContainer'>
            <Row>
                <Col xs={9}>
                    <span style={{ fontWeight: 'bold' }}>{workPhase.name}</span>
                </Col>
                <Col xs={3}>
                    {
                        <RightWrapper>
                            <EditButton
                                editable={editable}
                                setEditable={setEditable}
                            />
                            <DeleteButton
                                onDelete={onDelete}
                                id={recipeID}
                                subId={workPhase.id}
                            />
                        </RightWrapper>
                    }
                </Col>
            </Row>
            <Row>
                <Col>{workPhase.estimatedLength ? workPhase.estimatedLength : 0} {t('in_minutes')}</Col>
            </Row>
            {editable &&
                <AddWorkPhase
                    dbUrl={dbUrl}
                    translation={translation}
                    translationKeyPrefix={translationKeyPrefix}
                    workPhaseID={workPhase.id}
                    recipeID={recipeID}
                    onSave={updateWorkPhase}
                    onClose={() => setEditable(false)} />
            }
        </div>
    )
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