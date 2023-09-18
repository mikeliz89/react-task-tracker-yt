import { useState } from 'react';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import AddFoodItem from './AddFoodItem';
import FoodItems from './FoodItems';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import PageTitle from '../Site/PageTitle';
import Alert from '../Alert';
import PageContentWrapper from '../Site/PageContentWrapper';
import Counter from '../Site/Counter';
import CenterWrapper from '../Site/CenterWrapper';
import { pushToFirebase, removeFromFirebaseById, updateToFirebaseById } from '../../datatier/datatier';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../useToggle';
import useFetch from '../useFetch';

export default function ManageFoodItems() {

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_RECIPE, { keyPrefix: Constants.TRANSLATION_RECIPE });

    //fetch data
    const { data: foodItems, setData: setFoodItems,
        originalData: originalFoodItems, counter, loading } = useFetch(Constants.DB_FOODITEMS);

    //modal
    const { status: showAddFoodItem, toggleStatus: toggleAddFoodItem } = useToggle();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const addFoodItem = (foodItem) => {
        try {
            foodItem["created"] = getCurrentDateAsJson();
            foodItem["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_FOODITEMS, foodItem);
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
        removeFromFirebaseById(Constants.DB_FOODITEMS, id);
    }

    const editFoodItem = (foodItem) => {
        const id = foodItem.id;
        updateToFirebaseById(Constants.DB_FOODITEMS, id, foodItem);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('manage_fooditems_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={Constants.VARIANT_SUCCESS}
                onClose={() => { setShowMessage(false); setShowError(false); }}
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
                    iconName={Constants.ICON_PLUS}
                    color={showAddFoodItem ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                    text={showAddFoodItem ? t('button_close') : t('button_add_fooditem')}
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