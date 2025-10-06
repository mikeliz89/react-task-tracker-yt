import { ButtonGroup, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import GoBackButton from '../Buttons/GoBackButton';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import Movements from './Movements';
import CenterWrapper from '../Site/CenterWrapper';
import PageContentWrapper from '../Site/PageContentWrapper';
import Counter from '../Site/Counter';
import * as Constants from '../../utils/Constants';
import { removeFromFirebaseById, pushToFirebase } from '../../datatier/datatier';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import Button from '../Buttons/Button';
import AddMovement from './AddMovement';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useToggle } from '../useToggle';
import useFetch from '../useFetch';

export default function ManageMovements() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_EXERCISES });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, {keyPrefix: Constants.TRANSLATION_COMMON});

    //fetch data
    const { data: movements, setData: setMovements,
        originalData: originalMovements,
        counter, loading } = useFetch(Constants.DB_EXERCISE_MOVEMENTS);

    //modal
    const { status: showAddMovement, toggleStatus: toggleAddMovement } = useToggle();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //user
    const { currentUser } = useAuth();

    const deleteMovement = async (id) => {
        removeFromFirebaseById(Constants.DB_EXERCISE_MOVEMENTS, id);
    }

    function clearMessages() {
        setError('');
        setShowError(false);
        setMessage('');
        setShowMessage(false);
    }

    const addMovement = async (movement) => {
        try {
            clearMessages();
            movement["created"] = getCurrentDateAsJson();
            movement["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_EXERCISE_MOVEMENTS, movement);
            setMessage(t('save_success'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('movement_save_exception'));
            setShowError(true);
        }
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('manage_movements_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>

            {
                originalMovements != null && originalMovements.length > 0 ? (
                    <SearchSortFilter
                        onSet={setMovements}
                        originalList={originalMovements}
                        //search
                        showSearchByText={true}
                        //sort
                        showSortByCreatedDate={true}
                        showSortByStarRating={true}
                        showSortByName={true}
                        //filter
                        filterMode={FilterMode.Name}
                    />
                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={Constants.ICON_PLUS}
                    color={showAddMovement ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                    text={showAddMovement ? tCommon('buttons.button_close') : tCommon('buttons.button_save')}
                    onClick={toggleAddMovement} />
            </CenterWrapper>

            <Modal show={showAddMovement} onHide={toggleAddMovement}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_movement')}</Modal.Title> 
                </Modal.Header>
                <Modal.Body>
                    <AddMovement onSave={addMovement} onClose={toggleAddMovement} />
                </Modal.Body>
            </Modal>

            {
                movements != null && movements.length > 0 ? (
                    <>
                        <Counter list={movements} originalList={originalMovements} counter={counter} />
                        <Movements movements={movements}
                            onDelete={deleteMovement} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_movements_to_show')}
                        </CenterWrapper>
                    </>
                )
            }
        </PageContentWrapper>
    )
}