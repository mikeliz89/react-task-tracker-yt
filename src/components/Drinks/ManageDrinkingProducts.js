//react
import { useState, useEffect } from 'react';
import { Row, ButtonGroup, Alert, Form, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
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

const SortMode = {
    None: "None",
    Name_ASC: "Name_ASC",
    Name_DESC: "Name_DESC",
    Created_ASC: "Created_ASC",
    Created_DESC: "Created_DESC",
}

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
    const [searchString, setSearchString] = useState('');
    const [sortBy, setSortBy] = useState(SortMode.None)

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

    useEffect(() => {
        filterAndSort();
    }, [sortBy, searchString]);

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

    const filterAndSort = () => {
        if (!originalDrinkingProducts) {
            return;
        }
        let newDrinks = originalDrinkingProducts;
        //haut
        if (searchString !== "") {
            newDrinks = newDrinks.filter(drink => drink.name.toLowerCase().includes(searchString.toLowerCase()));
        }
        //filtterit: TODO
        //sortit
        if (sortBy === SortMode.Name_ASC || sortBy === SortMode.Name_DESC) {
            newDrinks = [...newDrinks].sort((a, b) => {
                return a.name > b.name ? 1 : -1
            });
            if (sortBy === SortMode.Name_DESC) {
                newDrinks.reverse();
            }
        } else if (sortBy === SortMode.Created_ASC || sortBy === SortMode.Created_DESC) {
            newDrinks = [...newDrinks].sort(
                (a, b) => new Date(a.created).setHours(0, 0, 0, 0) - new Date(b.created).setHours(0, 0, 0, 0)
            );
            if (sortBy === SortMode.Created_DESC) {
                newDrinks.reverse();
            }
        }
        setDrinkingProducts(newDrinks);
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
            <Form className='form-no-paddings'>
                <Form.Group as={Row}>
                    <Form.Label column xs={3} sm={2}>{t('sorting')}</Form.Label>
                    <Col xs={9} sm={10}>
                        <Button onClick={() => {
                            sortBy === SortMode.Created_ASC ? setSortBy(SortMode.Created_DESC) : setSortBy(SortMode.Created_ASC);
                        }} text={t('created_date')} type="button" />
                        {
                            sortBy === SortMode.Created_DESC ? <FaArrowDown /> : ''
                        }
                        {
                            sortBy === SortMode.Created_ASC ? <FaArrowUp /> : ''
                        }
                        &nbsp;
                        <Button onClick={() => {
                            sortBy === SortMode.Name_ASC ? setSortBy(SortMode.Name_DESC) : setSortBy(SortMode.Name_ASC);
                        }
                        }
                            text={t('name')} type="button"
                        />
                        {
                            sortBy === SortMode.Name_DESC ? <FaArrowDown /> : ''
                        }
                        {
                            sortBy === SortMode.Name_ASC ? <FaArrowUp /> : ''
                        }
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={3} sm={2}>{t('search')}</Form.Label>
                    <Col xs={9} sm={10}>
                        <Form.Control
                            type="text"
                            id="inputSearchString"
                            aria-describedby="searchHelpBlock"
                            onChange={(e) => setSearchString(e.target.value)}
                        />
                    </Col>
                </Form.Group>
            </Form>
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
