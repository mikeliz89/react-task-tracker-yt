import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import AddGear from './AddGear';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB, ICONS, COLORS, VARIANTS } from "../../utils/Constants";
import { useAuth } from '../../contexts/AuthContext';
import Gears from './Gears';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { SortMode } from '../SearchSortFilter/SortModes';
import Alert from '../Alert';
import PageContentWrapper from '../Site/PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';
import Counter from '../Site/Counter';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';
import { useAlert } from '../Hooks/useAlert';

export default function ManageGear() {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BACKPACKING });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: gear, setData: setGear,
        originalData: originalGear, counter, loading } = useFetch(DB.BACKPACKING_GEAR);

    //modal
    const { status: showAddGear, toggleStatus: toggleAddGear } = useToggle();

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

    const addGear = async (gear) => {
        try {
            clearMessages();
            gear["created"] = getCurrentDateAsJson();
            gear["createdBy"] = currentUser.email;
            pushToFirebase(DB.BACKPACKING_GEAR, gear);
            showSuccess(t('save_success'));
        } catch (ex) {
            showFailure(t('save_exception'));
        }
    }

    const deleteGear = (id) => {
        removeFromFirebaseById(DB.BACKPACKING_GEAR, id);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('my_gear_title')} />

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

            <Modal show={showAddGear} onHide={toggleAddGear}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_gear')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddGear onSave={addGear} onClose={toggleAddGear} />
                </Modal.Body>
            </Modal>

            {
                originalGear != null && originalGear.length > 0 ? (
                    <SearchSortFilter
                        onSet={setGear}
                        //search
                        showSearchByText={true}
                        originalList={originalGear}
                        //sort
                        defaultSort={SortMode.Name_ASC}
                        showSortByName={true}
                        showSortByStarRating={true}
                        //filter
                        filterMode={FilterMode.Name}
                    />
                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={ICONS.PLUS}
                    color={showAddGear ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                    text={showAddGear ? tCommon('buttons.button_close') : t('button_add_gear')}
                    onClick={toggleAddGear} />
            </CenterWrapper>

            {
                gear != null && gear.length > 0 ? (
                    <>
                        <Counter list={gear} originalList={originalGear} counter={counter} />
                        <Gears gears={gear}
                            onDelete={deleteGear} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_gear_to_show')}
                        </CenterWrapper>
                    </>
                )
            }
        </PageContentWrapper>
    )
}
