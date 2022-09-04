//react
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Row, ButtonGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
//firebase
import { ref, push, onValue, remove } from "firebase/database";
import { db } from '../../firebase-config';
//recipes
import Recipes from '../Recipe/Recipes';
//drinks
import AddDrink from './AddDrink';
//buttons
import GoBackButton from '../GoBackButton';
import Button from '../Button';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';
//pagetitle
import PageTitle from '../PageTitle';
//searchsortfilter
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
//alert
import Alert from '../Alert';
//recipetypes
import { RecipeTypes } from '../../utils/Enums';
import Icon from '../Icon';
//ScrollToTop
import ScrollToTop from '../ScrollToTop';
import CenterWrapper from '../CenterWrapper';

export default function ManageDrinks() {

    //constants
    const DB_DRINKS = '/drinks';
    const DB_DRINK = '/drink';
    const TRANSLATION = 'drinks';

    //translation
    const { t } = useTranslation(TRANSLATION, { keyPrefix: TRANSLATION });

    //navigate
    const navigate = useNavigate();

    //states
    const [loading, setLoading] = useState(true);
    const [showAddDrink, setShowAddDrink] = useState(false);
    const [drinks, setDrinks] = useState();
    const [originalDrinks, setOriginalDrinks] = useState();
    const [counter, setCounter] = useState(0);

    //alert
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

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

    const fetchDrinksFromFirebase = async () => {
        const dbref = await ref(db, DB_DRINKS);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;
            for (let id in snap) {
                counterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setCounter(counterTemp);
            setLoading(false);
            setDrinks(fromDB);
            setOriginalDrinks(fromDB);
        })
    }

    const addDrink = async (drink) => {
        try {
            drink["created"] = getCurrentDateAsJson();
            drink["createdBy"] = currentUser.email;
            if (drink["isCore"] === undefined) {
                drink["isCore"] = false;
            }
            const dbref = ref(db, DB_DRINKS);
            push(dbref, drink)
                .then((snap) => {
                    const key = snap.key;
                    navigate(`${DB_DRINK}/${key}`);
                })
            setMessage(t('save_success'));
            setShowMessage(true);
        } catch (ex) {
            setShowError(true);
            setError(t('save_exception'));
        }
    }

    const deleteDrink = (id) => {
        const dbref = ref(db, `${DB_DRINKS}/${id}`);
        remove(dbref);
    }

    const getCounterText = () => {
        if (originalDrinks === undefined) {
            return;
        }
        return drinks.length < originalDrinks.length ? drinks.length + '/' + counter : counter + '';
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

                <div>
                    <Link to="/managedrinkingproducts" className='btn btn-primary'>
                        <Icon name='wine-bottle' color='white' />
                        {t('button_manage_drinkingproducts')}
                    </Link>
                    &nbsp;
                    <Link to="/managedrinklists" className='btn btn-primary'>
                        <Icon name='list-alt' color='white' />
                        {t('button_drinklists')}
                    </Link>
                </div>

                <Alert message={message} showMessage={showMessage}
                    error={error} showError={showError}
                    variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

                {showAddDrink &&
                    <AddDrink onSave={addDrink} onClose={() => setShowAddDrink(false)} />
                }

                <SearchSortFilter
                    showFilterCore={true}
                    useTitleFiltering={true}
                    onSet={setDrinks}
                    showFilterHaveRated={true}
                    showFilterNotHaveRated={true}
                    showSortByTitle={true}
                    showSortByCreatedDate={true}
                    showSortByStarRating={true}
                    showSearchByDescription={true}
                    originalList={originalDrinks} />
                {
                    drinks != null && drinks.length > 0 ? (
                        <>
                            <CenterWrapper>
                                {getCounterText()}
                            </CenterWrapper>
                            <Recipes
                                translation={TRANSLATION}
                                recipes={drinks}
                                recipeType={RecipeTypes.Drink}
                                onDelete={deleteDrink} />
                        </>
                    ) : (
                        t('no_drinks_to_show')
                    )
                }
            </div>
            <ScrollToTop />
        </div>
    )
}
