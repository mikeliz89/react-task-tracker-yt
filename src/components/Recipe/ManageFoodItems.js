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
//recipe
import AddFoodItem from './AddFoodItem';
import FoodItems from './FoodItems';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';
//searchsortfilter
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';

const ManageFoodItems = () => {

    const DB_FOODITEMS = '/fooditems';

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

    //states
    const [showAddFoodItem, setShowAddFoodItem] = useState(false);
    const [foodItems, setFoodItems] = useState();
    const [originalFoodItems, setOriginalFoodItems] = useState();
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [error, setError] = useState('');

    //load data
    useEffect(() => {
        let cancel = false;

        const getFoodItems = async () => {
            if (cancel) {
                return;
            }
            await fetchFoodItemsFromFirebase()
        }
        getFoodItems()

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
            setMessage(t('fooditem_save_successfull'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('fooditem_save_exception'));
        }
    }

    const deleteFoodItem = (id) => {
        const dbref = ref(db, `${DB_FOODITEMS}/${id}`);
        remove(dbref)
    }

    const editFoodItem = (foodItem) => {
        const id = foodItem.id;
        //save
        const updates = {};
        updates[`${DB_FOODITEMS}/${id}`] = foodItem;
        update(ref(db), updates);
    }

    /** Fetch Food Items From Firebase */
    const fetchFoodItemsFromFirebase = async () => {
        const dbref = await ref(db, DB_FOODITEMS);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setFoodItems(fromDB);
            setOriginalFoodItems(fromDB);
        })
    }

    return (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        color={showAddFoodItem ? 'red' : 'green'}
                        text={showAddFoodItem ? t('button_close') : t('button_add_fooditem')}
                        onClick={() => setShowAddFoodItem(!showAddFoodItem)} />
                </ButtonGroup>
            </Row>
            <h3 className="page-title">{t('manage_fooditems_title')}</h3>
            {error && <div className="error">{error}</div>}
            {message &&
                <Alert show={showMessage} variant='success'>
                    {message}
                    <div className='d-flex justify-content-end'>
                        <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
                    </div>
                </Alert>
            }
            {showAddFoodItem &&
                <AddFoodItem onClose={() => setShowAddFoodItem(!showAddFoodItem)} onAddFoodItem={addFoodItem} />}
            <SearchSortFilter
                showFilterHaveAtHome={true}
                showFilterNotHaveAtHome={true}
                onSet={setFoodItems}
                showSortByName={true}
                showSortByCreatedDate={true}
                originalList={originalFoodItems} />
            {
                foodItems != null && foodItems.length > 0 ? (
                    <FoodItems foodItems={foodItems}
                        onDelete={deleteFoodItem}
                        onEdit={editFoodItem} />
                ) : (
                    t('no_fooditems_to_show')
                )
            }
        </div>
    )
}

export default ManageFoodItems
