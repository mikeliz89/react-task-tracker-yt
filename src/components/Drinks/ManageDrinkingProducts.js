import { useState } from 'react';
import { Row, ButtonGroup, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import AddDrinkingProduct from './AddDrinkingProduct';
import DrinkingProducts from './DrinkingProducts';
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
import { useToggle } from '../UseToggle';
import useFetch from '../useFetch';

export default function ManageDrinkingProducts() {

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_DRINKS, { keyPrefix: Constants.TRANSLATION_DRINKS });

    //fetch data
    const { data: drinkingProducts, setData: setDrinkingProducts,
        originalData: originalDrinkingProducts,
        counter, loading } = useFetch(Constants.DB_DRINKINGPRODUCTS);

    //modal
    const { status: showAddDrinkingProduct, toggleStatus: toggleAddDrinkingProduct } = useToggle();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const addDrinkingProduct = (drinkingProduct) => {
        try {
            drinkingProduct["created"] = getCurrentDateAsJson();
            drinkingProduct["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_DRINKINGPRODUCTS, drinkingProduct);
            setMessage(t('drinkingproduct_save_successful'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('drinkingproduct_save_exception'));
            setShowError(true);
        }
    }

    const deleteDrinkingProduct = (id) => {
        removeFromFirebaseById(Constants.DB_DRINKINGPRODUCTS, id);
    }

    const editDrinkingProduct = (drinkingProduct) => {
        const id = drinkingProduct.id;
        updateToFirebaseById(Constants.DB_DRINKINGPRODUCTS, id, drinkingProduct);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>

            <PageTitle title={t('manage_drinkingproducts_title')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }}
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
                    iconName={Constants.ICON_PLUS}
                    secondIconName={Constants.ICON_WINE}
                    color={showAddDrinkingProduct ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                    text={showAddDrinkingProduct ? t('button_close') : t('button_add_drinkingproduct')}
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