//react
import { useState, useEffect } from 'react';
import { Row, ButtonGroup, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
//firebase
import { ref, push, onValue, remove, update } from "firebase/database";
import { db } from '../../firebase-config';
//button
import GoBackButton from '../GoBackButton';
import Button from '../Button';
//drinks
import AddDrinkingProduct from './AddDrinkingProduct';
import DrinkingProducts from './DrinkingProducts';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';
//searchsortfilter
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';

const ManageDrinkingProducts = () => {

    const DB_DRINKINGPRODUCTS = '/drinkingproducts';

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    //states
    const [showAddDrinkingProduct, setShowAddDrinkingProduct] = useState(false);
    const [drinkingProducts, setDrinkingProducts] = useState();
    const [originalDrinkingProducts, setOriginalDrinkingProducts] = useState();
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [error, setError] = useState('');

    //load data
    useEffect(() => {
        let cancel = false;

        const getDrinkingProducts = async () => {
            if (cancel) {
                return;
            }
            await fetchDrinkingProductsFromFirebase()
        }
        getDrinkingProducts()

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
            const dbref = ref(db, DB_DRINKINGPRODUCTS);
            push(dbref, drinkingProduct);
            setMessage(t('drinkingproduct_save_successfull'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('drinkingproduct_save_exception'));
        }
    }

    const deleteDrinkingProduct = (id) => {
        const dbref = ref(db, `${DB_DRINKINGPRODUCTS}/${id}`);
        remove(dbref)
    }

    const editDrinkingProduct = (drinkingProduct) => {
        const id = drinkingProduct.id;
        //save
        const updates = {};
        if (drinkingProduct["abv"] === undefined) {
            drinkingProduct["abv"] = 0;
        }
        updates[`${DB_DRINKINGPRODUCTS}/${id}`] = drinkingProduct;
        update(ref(db), updates);
    }

    /** Fetch Drinking Products From Firebase */
    const fetchDrinkingProductsFromFirebase = async () => {
        const dbref = await ref(db, DB_DRINKINGPRODUCTS);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setDrinkingProducts(fromDB);
            setOriginalDrinkingProducts(fromDB);
        })
    }

    return (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        color={showAddDrinkingProduct ? 'red' : 'green'}
                        text={showAddDrinkingProduct ? t('button_close') : t('button_add_drinkingproduct')}
                        onClick={() => setShowAddDrinkingProduct(!showAddDrinkingProduct)} />
                </ButtonGroup>
            </Row>
            <h3 className="page-title">{t('manage_drinkingproducts_title')}</h3>
            {error && <div className="error">{error}</div>}
            {message &&
                <Alert show={showMessage} variant='success'>
                    {message}
                    <div className='d-flex justify-content-end'>
                        <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
                    </div>
                </Alert>
            }
            {showAddDrinkingProduct &&
                <AddDrinkingProduct onClose={() => setShowAddDrinkingProduct(!showAddDrinkingProduct)} onAddDrinkingProduct={addDrinkingProduct} />}
            <SearchSortFilter
                onSet={setDrinkingProducts}
                showFilterHaveAtHome={true}
                showFilterNotHaveAtHome={true}
                showSortByName={true}
                showSortByCreatedDate={true}
                originalList={originalDrinkingProducts} />
            {
                drinkingProducts != null && drinkingProducts.length > 0 ? (
                    <DrinkingProducts drinkingProducts={drinkingProducts}
                        onDelete={deleteDrinkingProduct}
                        onEdit={editDrinkingProduct} />
                ) : (
                    t('no_drinkingproducts_to_show')
                )
            }
        </div>
    )
}

export default ManageDrinkingProducts
