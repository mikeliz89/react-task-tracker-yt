//react
import { useState, useEffect } from 'react';
import { Row, ButtonGroup, Alert, Form, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
//firebase
import { ref, push, onValue, remove } from "firebase/database";
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
            if (drinkingProduct["category"] === t('category_none')) {
                drinkingProduct["category"] = '';
            }
            drinkingProduct["created"] = getCurrentDateAsJson();
            drinkingProduct["createdBy"] = currentUser.email;
            const dbref = ref(db, '/drinkingproducts');
            push(dbref, drinkingProduct);
            setMessage(t('drinkingproduct_save_successfull'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('drinkingproduct_save_exception'));
        }
    }

    const deleteDrinkingProduct = (id) => {
        const dbref = ref(db, `/drinkingproducts/${id}`);
        remove(dbref)
    }

    /** Fetch Drinking Products From Firebase */
    const fetchDrinkingProductsFromFirebase = async () => {
        const dbref = await ref(db, '/drinkingproducts');
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
            <SearchSortFilter
                onSet={setDrinkingProducts}
                showSortByName={true}
                showSortByTitle={true}
                originalList={originalDrinkingProducts} />
            {showAddDrinkingProduct && <AddDrinkingProduct onAddDrinkingProduct={addDrinkingProduct} />}
            {
                drinkingProducts != null && drinkingProducts.length > 0 ? (
                    <DrinkingProducts drinkingProducts={drinkingProducts}
                        onDelete={deleteDrinkingProduct} />
                ) : (
                    t('no_drinkingproducts_to_show')
                )
            }
        </div>
    )
}

export default ManageDrinkingProducts
