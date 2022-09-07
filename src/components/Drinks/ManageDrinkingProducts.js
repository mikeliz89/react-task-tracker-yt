import { useState, useEffect } from 'react';
import { Row, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ref, onValue, update } from "firebase/database";
import { db } from '../../firebase-config';
import GoBackButton from '../GoBackButton';
import Button from '../Button';
import AddDrinkingProduct from './AddDrinkingProduct';
import DrinkingProducts from './DrinkingProducts';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import PageTitle from '../PageTitle';
import Alert from '../Alert';
import PageContentWrapper from '../PageContentWrapper';
import Counter from '../Counter';
import CenterWrapper from '../CenterWrapper';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';

const ManageDrinkingProducts = () => {

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_DRINKS, { keyPrefix: Constants.TRANSLATION_DRINKS });

    //states
    const [showAddDrinkingProduct, setShowAddDrinkingProduct] = useState(false);
    const [drinkingProducts, setDrinkingProducts] = useState();
    const [originalDrinkingProducts, setOriginalDrinkingProducts] = useState();
    const [counter, setCounter] = useState(0);
    const [loading, setLoading] = useState(true);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //load data
    useEffect(() => {
        let cancel = false;

        const getDrinkingProducts = async () => {
            if (cancel) {
                return;
            }
            await fetchDrinkingProductsFromFirebase();
        }
        getDrinkingProducts();

        return () => {
            cancel = true;
        }
    }, [])

    const addDrinkingProduct = (drinkingProduct) => {
        try {
            drinkingProduct["created"] = getCurrentDateAsJson();
            drinkingProduct["createdBy"] = currentUser.email;
            if (drinkingProduct["abv"] === undefined) {
                drinkingProduct["abv"] = 0;
            }
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
        //save
        const updates = {};
        if (drinkingProduct["abv"] === undefined) {
            drinkingProduct["abv"] = 0;
        }
        updates[`${Constants.DB_DRINKINGPRODUCTS}/${id}`] = drinkingProduct;
        update(ref(db), updates);
    }

    const fetchDrinkingProductsFromFirebase = async () => {
        const dbref = await ref(db, Constants.DB_DRINKINGPRODUCTS);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;
            for (let id in snap) {
                counterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setCounter(counterTemp);
            setDrinkingProducts(fromDB);
            setOriginalDrinkingProducts(fromDB);
            setLoading(false);
        })
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName='plus'
                        secondIconName='wine-bottle'
                        color={showAddDrinkingProduct ? 'red' : 'green'}
                        text={showAddDrinkingProduct ? t('button_close') : t('button_add_drinkingproduct')}
                        onClick={() => setShowAddDrinkingProduct(!showAddDrinkingProduct)} />
                </ButtonGroup>
            </Row>
            <PageTitle title={t('manage_drinkingproducts_title')} />

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            {showAddDrinkingProduct &&
                <AddDrinkingProduct onClose={() => setShowAddDrinkingProduct(!showAddDrinkingProduct)} onAddDrinkingProduct={addDrinkingProduct} />}
            <SearchSortFilter
                useNameFiltering={true}
                onSet={setDrinkingProducts}
                showFilterHaveAtHome={true}
                showFilterNotHaveAtHome={true}
                showSortByName={true}
                showSortByCreatedDate={true}
                showSearchByDescription={true}
                originalList={originalDrinkingProducts} />
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

export default ManageDrinkingProducts
