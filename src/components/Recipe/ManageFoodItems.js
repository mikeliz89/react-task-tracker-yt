//react
import { useState, useEffect } from 'react';
import { Row, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
//firebase
import { ref, push, onValue, remove, update } from "firebase/database";
import { db } from '../../firebase-config';
//button
import GoBackButton from '../GoBackButton';
import Button from '../Button';
//recipe
import AddFoodItem from './AddFoodItem';
import FoodItems from './FoodItems';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';
//searchsortfilter
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
//pagetitle
import PageTitle from '../PageTitle';
//alert
import Alert from '../Alert';
//page
import PageContentWrapper from '../PageContentWrapper';
//counter
import Counter from '../Counter';
//center
import CenterWrapper from '../CenterWrapper';

const ManageFoodItems = () => {

    const DB_FOODITEMS = '/fooditems';

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

    //states
    const [loading, setLoading] = useState(true);
    const [showAddFoodItem, setShowAddFoodItem] = useState(false);
    const [counter, setCounter] = useState(0);
    const [foodItems, setFoodItems] = useState();
    const [originalFoodItems, setOriginalFoodItems] = useState();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //load data
    useEffect(() => {
        let cancel = false;

        const getFoodItems = async () => {
            if (cancel) {
                return;
            }
            await fetchFoodItemsFromFirebase();
        }
        getFoodItems();

        return () => {
            cancel = true;
        }
    }, [])

    const addFoodItem = (foodItem) => {
        try {
            foodItem["created"] = getCurrentDateAsJson();
            foodItem["createdBy"] = currentUser.email;
            const dbref = ref(db, DB_FOODITEMS);
            push(dbref, foodItem);
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
        const dbref = ref(db, `${DB_FOODITEMS}/${id}`);
        remove(dbref);
    }

    const editFoodItem = (foodItem) => {
        const id = foodItem.id;
        //save
        const updates = {};
        updates[`${DB_FOODITEMS}/${id}`] = foodItem;
        update(ref(db), updates);
    }

    const fetchFoodItemsFromFirebase = async () => {
        const dbref = await ref(db, DB_FOODITEMS);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;
            for (let id in snap) {
                counterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setCounter(counterTemp);
            setFoodItems(fromDB);
            setOriginalFoodItems(fromDB);
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
                        color={showAddFoodItem ? 'red' : 'green'}
                        text={showAddFoodItem ? t('button_close') : t('button_add_fooditem')}
                        onClick={() => setShowAddFoodItem(!showAddFoodItem)} />
                </ButtonGroup>
            </Row>
            <PageTitle title={t('manage_fooditems_title')} />
            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />
            {
                showAddFoodItem &&
                <AddFoodItem onClose={() => setShowAddFoodItem(!showAddFoodItem)} onAddFoodItem={addFoodItem} />
            }
            <SearchSortFilter
                useNameFiltering={true}
                showFilterHaveAtHome={true}
                showFilterNotHaveAtHome={true}
                onSet={setFoodItems}
                showSortByName={true}
                showSortByCreatedDate={true}
                originalList={originalFoodItems} />
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

export default ManageFoodItems
