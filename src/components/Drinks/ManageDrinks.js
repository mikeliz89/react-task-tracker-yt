//react
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Form, Col, Row, ButtonGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
//firebase
import { ref, push, onValue, remove } from "firebase/database";
import { db } from '../../firebase-config';
//drinks
import Drinks from './Drinks';
import AddDrink from './AddDrink';
//buttons
import GoBackButton from '../GoBackButton';
import Button from '../Button';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';
import PageTitle from '../PageTitle';

import Icon from '../Icon';

const SortMode = {
    None: "None",
    Name_ASC: "Name_ASC",
    Name_DESC: "Name_DESC",
    Created_ASC: "Created_ASC",
    Created_DESC: "Created_DESC",
}

export default function ManageDrinks() {

    //constants
    const DB_DRINKS = '/drinks';
    const DB_DRINK = '/drink';

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    //navigate
    const navigate = useNavigate();

    //states
    const [loading, setLoading] = useState(true);
    const [showAddDrink, setShowAddDrink] = useState(false);
    const [drinks, setDrinks] = useState();
    const [originalDrinks, setOriginalDrinks] = useState();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    //filters
    const [showOnlyDone, setShowOnlyDone] = useState(false);
    const [showOnlyNotDone, setShowOnlyNotDone] = useState(false);

    //search
    const [searchString, setSearchString] = useState('');

    //sorting
    const [sortBy, setSortBy] = useState(SortMode.None);

    //user
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        let cancel = false;

        const getDrinks = async () => {
            if (cancel) {
                return;
            }
            await fetchDrinksFromFirebase();
        }
        getDrinks();

        return () => {
            cancel = true;
        }
    }, [])

    useEffect(() => {
        filterAndSort();
    }, [sortBy, searchString, showOnlyDone, showOnlyNotDone])

    /** Fetch Drinks From Firebase */
    const fetchDrinksFromFirebase = async () => {
        const dbref = await ref(db, DB_DRINKS);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const drinksFromDB = [];
            for (let id in snap) {
                drinksFromDB.push({ id, ...snap[id] });
            }
            setLoading(false);
            setDrinks(drinksFromDB);
            setOriginalDrinks(drinksFromDB);
        })
    }

    /** Add Drink To Firebase */
    const addDrink = async (drink) => {
        try {
            drink["created"] = getCurrentDateAsJson();
            drink["createdBy"] = currentUser.email;
            const dbref = ref(db, DB_DRINKS);
            push(dbref, drink)
                .then((snap) => {
                    const key = snap.key;
                    navigate(`${DB_DRINK}/${key}`);
                })
            setMessage(t('save_success'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('save_exception'));
        }
    }

    const deleteDrink = (id) => {
        const dbref = ref(db, `${DB_DRINKS}/${id}`);
        remove(dbref);
    }

    const filterAndSort = () => {
        if (!originalDrinks) {
            return;
        }
        let newDrinks = originalDrinks;
        //haut
        if (searchString !== "") {
            newDrinks = newDrinks.filter(drink => drink.title.toLowerCase().includes(searchString.toLowerCase()));
        }
        //filtterit:
        if (showOnlyDone) {
            newDrinks = newDrinks.filter(drink => drink.stars !== undefined && drink.stars > 0);
        } else if (showOnlyNotDone) {
            newDrinks = newDrinks.filter(drink => drink.stars === undefined || drink.stars === 0);
        }
        //sortit
        if (sortBy === SortMode.Name_ASC || sortBy === SortMode.Name_DESC) {
            newDrinks = [...newDrinks].sort((a, b) => {
                return a.title > b.title ? 1 : -1
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
        setDrinks(newDrinks);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        color={showAddDrink ? 'red' : 'green'}
                        text={showAddDrink ? t('button_close') : t('button_add_drinks')}
                        onClick={() => setShowAddDrink(!showAddDrink)} />
                </ButtonGroup>
            </Row>
            <PageTitle title={t('manage_drinks_title')} />
            <div className="page-content">
                <Link to="/managedrinkingproducts" className='btn btn-primary'>{t('manage_drinkingproducts_button')}</Link>
                {error && <div className="error">{error}</div>}
                {message &&
                    <Alert show={showMessage} variant='success'>
                        {message}
                        <div className='d-flex justify-content-end'>
                            <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
                        </div>
                    </Alert>}
                {showAddDrink && <AddDrink onAddDrink={addDrink} onClose={() => setShowAddDrink(false)} />}
                <Form className='form-no-paddings'>
                    <Form.Group as={Row}>
                        <Form.Label column xs={3} sm={2}>{t('sorting')}</Form.Label>
                        <Col xs={9} sm={10}>
                            <Button onClick={() => {
                                sortBy === SortMode.Created_ASC ? setSortBy(SortMode.Created_DESC) : setSortBy(SortMode.Created_ASC);
                            }} text={t('created_date')} type="button" />
                            {
                                sortBy === SortMode.Created_DESC ? <Icon name='arrow-down' /> : ''
                            }
                            {
                                sortBy === SortMode.Created_ASC ? <Icon name='arrow-up' /> : ''
                            }
                            &nbsp;
                            <Button onClick={() => {
                                sortBy === SortMode.Name_ASC ? setSortBy(SortMode.Name_DESC) : setSortBy(SortMode.Name_ASC);
                            }
                            }
                                text={t('name')} type="button"
                            />
                            {
                                sortBy === SortMode.Name_DESC ? <Icon name='arrow-down' /> : ''
                            }
                            {
                                sortBy === SortMode.Name_ASC ? <Icon name='arrow-up' /> : ''
                            }
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column xs={3} sm={2}>{t('search')}</Form.Label>
                        <Col xs={9} sm={10}>
                            <Form.Control
                                autoComplete="off"
                                type="text"
                                id="inputSearchString"
                                aria-describedby="searchHelpBlock"
                                onChange={(e) => setSearchString(e.target.value)}
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalCheck-ShowOnlyDone">
                        <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                        <Col xs={9} sm={10}>
                            <Form.Check label={t('show_only_done')}
                                onChange={(e) => {
                                    setShowOnlyDone(e.currentTarget.checked);
                                }} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formHorizontalCheck-ShowOnlyNotDone">
                        <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                        <Col xs={9} sm={10}>
                            <Form.Check label={t('show_only_not_done')}
                                onChange={(e) => {
                                    setShowOnlyNotDone(e.currentTarget.checked);
                                }} />
                        </Col>
                    </Form.Group>
                </Form>
                {
                    drinks != null && drinks.length > 0 ? (
                        <Drinks drinks={drinks}
                            onDelete={deleteDrink} />
                    ) : (
                        t('no_drinks_to_show')
                    )
                }
            </div>
        </div>
    )
}
