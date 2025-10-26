import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import AddFoodItem from './AddFoodItem';
import FoodItems from './FoodItems';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { TRANSLATION, COLORS, DB, ICONS } from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import PageTitle from '../Site/PageTitle';
import Alert from '../Alert';
import PageContentWrapper from '../Site/PageContentWrapper';
import Counter from '../Site/Counter';
import CenterWrapper from '../Site/CenterWrapper';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';
import { useAlert } from '../Hooks/useAlert';

export default function ManageFoodItems() {

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: foodItems, setData: setFoodItems,
        originalData: originalFoodItems, counter, loading } = useFetch(DB.FOODITEMS);

    //modal
    const { status: showAddFoodItem, toggleStatus: toggleAddFoodItem } = useToggle();

    //alert
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages
    } = useAlert();

    const addFoodItem = (foodItem) => {
        try {
            foodItem["created"] = getCurrentDateAsJson();
            foodItem["createdBy"] = currentUser.email;
            pushToFirebase(DB.FOODITEMS, foodItem);
            showSuccess();
        } catch (ex) {
            showFailure();
        }
    }

    function showSuccess() {
        setMessage(t('fooditem_save_successful'));
        setShowMessage(true);
    }

    function showFailure() {
        setError(t('fooditem_save_exception'));
        setShowError(true);
    }

    const deleteFoodItem = (id) => {
        removeFromFirebaseById(DB.FOODITEMS, id);
    }

    const editFoodItem = (foodItem) => {
        const id = foodItem.id;
        updateToFirebaseById(DB.FOODITEMS, id, foodItem);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('manage_fooditems_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>

            <Alert
                message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                onClose={clearMessages}
            />
            <Modal show={showAddFoodItem} onHide={toggleAddFoodItem}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_food_item')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddFoodItem onClose={toggleAddFoodItem}
                        onAddFoodItem={addFoodItem} />
                </Modal.Body>
            </Modal>

            {
                originalFoodItems != null && originalFoodItems.length > 0 ? (
                    <SearchSortFilter
                        onSet={setFoodItems}
                        originalList={originalFoodItems}
                        //search
                        showSearchByText={true}
                        //sort
                        showSortByName={true}
                        showSortByCreatedDate={true}
                        //filter
                        filterMode={FilterMode.Name}
                        showFilterHaveAtHome={true}
                        showFilterNotHaveAtHome={true}
                    />
                ) : (<></>)
            }

            <CenterWrapper>
                <Button
                    iconName={ICONS.PLUS}
                    color={showAddFoodItem ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                    text={showAddFoodItem ? tCommon('buttons.button_close') : t('button_add_fooditem')}
                    onClick={toggleAddFoodItem} />
            </CenterWrapper>

            {
                foodItems != null && foodItems.length > 0 ? (
                    <>
                        <Counter list={foodItems} originalList={originalFoodItems} counter={counter} />
                        <FoodItems foodItems={foodItems}
                            onDelete={deleteFoodItem}
                            onEdit={editFoodItem} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_fooditems_to_show')}
                        </CenterWrapper>
                    </>
                )
            }
        </PageContentWrapper>
    )
}