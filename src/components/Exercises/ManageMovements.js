import { ButtonGroup, Modal, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import GoBackButton from '../Buttons/GoBackButton';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import Movements from './Movements';
import CenterWrapper from '../Site/CenterWrapper';
import PageContentWrapper from '../Site/PageContentWrapper';
import Counter from '../Site/Counter';
import { TRANSLATION, DB, ICONS, COLORS, VARIANTS } from '../../utils/Constants';
import { removeFromFirebaseById, pushToFirebase } from '../../datatier/datatier';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import Button from '../Buttons/Button';
import AddMovement from './AddMovement';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';
import { useAlert } from '../Hooks/useAlert';
import Alert from '../Alert';

export default function ManageMovements() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: movements, setData: setMovements,
        originalData: originalMovements,
        counter, loading } = useFetch(DB.EXERCISE_MOVEMENTS);

    //modal
    const { status: showAddMovement, toggleStatus: toggleAddMovement } = useToggle();

    //alert
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages,
        showSuccess,
        showFailure
    } = useAlert();

    //user
    const { currentUser } = useAuth();

    const deleteMovement = async (id) => {
        removeFromFirebaseById(DB.EXERCISE_MOVEMENTS, id);
    }


    const addMovement = async (movementID, movement) => {
        try {
            clearMessages();
            movement["created"] = getCurrentDateAsJson();
            movement["createdBy"] = currentUser.email;
            pushToFirebase(DB.EXERCISE_MOVEMENTS, movement);
            showSuccess(t('save_success'));
        } catch (ex) {
            showFailure(t('movement_save_exception'));
            console.warn(ex);
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

            <Alert message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={clearMessages}
            />

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
                    iconName={ICONS.PLUS}
                    color={showAddMovement ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
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