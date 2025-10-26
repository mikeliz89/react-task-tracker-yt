import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import AddDrinkingProduct from './AddDrinkingProduct';
import DrinkingProducts from './DrinkingProducts';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB, ICONS, COLORS } from '../../utils/Constants';
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

export default function ManageDrinkingProducts() {

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //fetch data
    const { data: drinkingProducts, setData: setDrinkingProducts,
        originalData: originalDrinkingProducts,
        counter, loading } = useFetch(DB.DRINKINGPRODUCTS);

    //modal
    const { status: showAddDrinkingProduct, toggleStatus: toggleAddDrinkingProduct } = useToggle();

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

    const addDrinkingProduct = (drinkingProduct) => {
        try {
            drinkingProduct["created"] = getCurrentDateAsJson();
            drinkingProduct["createdBy"] = currentUser.email;
            pushToFirebase(DB.DRINKINGPRODUCTS, drinkingProduct);
            showSuccess(t('drinkingproduct_save_successful'));
        } catch (ex) {
            showFailure(t('drinkingproduct_save_exception'));
        }
    }

    const deleteDrinkingProduct = (id) => {
        removeFromFirebaseById(DB.DRINKINGPRODUCTS, id);
    }

    const editDrinkingProduct = (drinkingProduct) => {
        const id = drinkingProduct.id;
        updateToFirebaseById(DB.DRINKINGPRODUCTS, id, drinkingProduct);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('manage_drinkingproducts_title')} />

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

            <Modal show={showAddDrinkingProduct} onHide={toggleAddDrinkingProduct}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_add_drinking_product')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddDrinkingProduct
                        onClose={toggleAddDrinkingProduct}
                        onAddDrinkingProduct={addDrinkingProduct}
                    />
                </Modal.Body>
            </Modal>

            {
                originalDrinkingProducts != null && originalDrinkingProducts.length > 0 ? (
                    <SearchSortFilter
                        onSet={setDrinkingProducts}
                        originalList={originalDrinkingProducts}
                        //search
                        showSearchByDescription={true}
                        //sort
                        showSortByCreatedDate={true}
                        showSortByName={true}
                        showSortByStarRating={true}
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
                    secondIconName={ICONS.WINE}
                    color={showAddDrinkingProduct ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                    text={showAddDrinkingProduct ? tCommon('buttons.button_close') : t('button_add_drinkingproduct')}
                    onClick={toggleAddDrinkingProduct} />
            </CenterWrapper>

            {
                drinkingProducts != null && drinkingProducts.length > 0 ? (
                    <>
                        <Counter list={drinkingProducts} originalList={originalDrinkingProducts} counter={counter} />
                        <DrinkingProducts drinkingProducts={drinkingProducts}
                            onDelete={deleteDrinkingProduct}
                            onEdit={editDrinkingProduct} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_drinkingproducts_to_show')}
                        </CenterWrapper>
                    </>
                )
            }
        </PageContentWrapper>
    )
}