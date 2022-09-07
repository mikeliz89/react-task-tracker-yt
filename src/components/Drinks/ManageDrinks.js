import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Row, ButtonGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ref, push, onValue } from "firebase/database";
import { db } from '../../firebase-config';
import Recipes from '../Recipe/Recipes';
import AddDrink from './AddDrink';
import GoBackButton from '../GoBackButton';
import Button from '../Button';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import PageTitle from '../PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import Alert from '../Alert';
import { RecipeTypes } from '../../utils/Enums';
import Icon from '../Icon';
import PageContentWrapper from '../PageContentWrapper';
import Counter from '../Counter';
import CenterWrapper from '../CenterWrapper';
import { removeFromFirebaseById } from '../../datatier/datatier';

export default function ManageDrinks() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_DRINKS, { keyPrefix: Constants.TRANSLATION_DRINKS });

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
        const dbref = await ref(db, Constants.DB_DRINKS);
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
            const dbref = ref(db, Constants.DB_DRINKS);
            push(dbref, drink).then((snap) => {
                const key = snap.key;
                navigate(`${Constants.NAVIGATION_DRINK}/${key}`);
            })
            setMessage(t('save_success'));
            setShowMessage(true);
        } catch (ex) {
            setShowError(true);
            setError(t('save_exception'));
        }
    }

    const deleteDrink = (id) => {
        removeFromFirebaseById(Constants.DB_DRINKS, id);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
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
                        <Counter list={drinks} originalList={originalDrinks} counter={counter} />
                        <Recipes
                            translation={Constants.TRANSLATION_DRINKS}
                            recipes={drinks}
                            recipeType={RecipeTypes.Drink}
                            onDelete={deleteDrink} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_drinks_to_show')}
                        </CenterWrapper>
                    </>
                )
            }
        </PageContentWrapper>
    )
}
