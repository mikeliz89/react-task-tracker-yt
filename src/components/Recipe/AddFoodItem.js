//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../Button';
//recipe
import { FoodItemCategories } from './Categories';

const AddFoodItem = ({ foodItemID, onAddFoodItem, onClose }) => {

    const DB_FOODITEMS = '/fooditems';

    //translation
    const { t, ready } = useTranslation('recipe', { keyPrefix: 'recipe' });

    //states
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState(FoodItemCategories);
    const [name, setName] = useState('');
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');

    //nutrition info
    const [carbs, setCarbs] = useState(0);
    const [calories, setCalories] = useState(0);
    const [fat, setFat] = useState(0);
    const [fiber, setFiber] = useState(0);
    const [protein, setProtein] = useState(0);
    const [salt, setSalt] = useState(0);

    //load data
    useEffect(() => {
        if (foodItemID != null) {
            const getFoodItem = async () => {
                await fetchFoodItemFromFirebase(foodItemID)
            }
            getFoodItem()
        }
    }, [foodItemID]);

    useEffect(() => {
        sortCategoriesByName();
    }, [ready]);

    const sortCategoriesByName = () => {
        const sortedCategories = [...categories].sort((a, b) => {
            const aName = t(`fooditem_category_${a.name}`);
            const bName = t(`fooditem_category_${b.name}`);
            return aName > bName ? 1 : -1;
        });
        setCategories(sortedCategories);
    }

    /** get food item from firebase by id (in EDIT food item) */
    const fetchFoodItemFromFirebase = async (id) => {
        const dbref = ref(db, `${DB_FOODITEMS}/${id}`);
        get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                setCalories(val["calories"]);
                setCarbs(val["carbs"]);
                setCategory(val["category"]);
                setCreated(val["created"]);
                setCreatedBy(val["createdBy"]);
                setFat(val["fat"]);
                setFiber(val["fiber"]);
                setName(val["name"]);
                setProtein(val["protein"]);
                setSalt(val["salt"]);
            }
        });
    }

    /** Form Submit */
    const onSubmit = (e) => {
        e.preventDefault()

        //validation
        if (!name) {
            alert(t('fooditem_please_add_name'))
            return
        }

        onAddFoodItem({
            created, createdBy,
            calories, carbs, category,
            fat, fiber, name, protein, salt
        });

        if (foodItemID == null) {
            //clear the form
            setCalories(0);
            setCarbs(0);
            setCategory('');
            setFat(0);
            setFiber(0);
            setName('');
            setProtein(0);
            setSalt(0);
        }
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addFoodItemForm-Name">
                    <Form.Label>{t('fooditem_name')}</Form.Label>
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('fooditem_name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFoodItemForm-Category">
                    <Form.Label>{t('fooditem_category')}</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                        {categories.map(({ id, name }) => (
                            <option value={id}
                                key={id}>{t(`fooditem_category_${name}`)}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFoodItemForm-Calories">
                    <Form.Label>{t('fooditem_calories')}</Form.Label>
                    <Form.Control type='number'
                        autoComplete="off"
                        placeholder={t('fooditem_calories')}
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFoodItemForm-Carbs">
                    <Form.Label>{t('fooditem_carbs')}</Form.Label>
                    <Form.Control type='number'
                        autoComplete="off"
                        placeholder={t('fooditem_carbs')}
                        value={carbs}
                        onChange={(e) => setCarbs(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFoodItemForm-Fat">
                    <Form.Label>{t('fooditem_fat')}</Form.Label>
                    <Form.Control type='number'
                        autoComplete="off"
                        placeholder={t('fooditem_fat')}
                        value={fat}
                        onChange={(e) => setFat(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFoodItemForm-Protein">
                    <Form.Label>{t('fooditem_protein')}</Form.Label>
                    <Form.Control type='number'
                        autoComplete="off"
                        placeholder={t('fooditem_protein')}
                        value={protein}
                        onChange={(e) => setProtein(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFoodItemForm-Salt">
                    <Form.Label>{t('fooditem_salt')}</Form.Label>
                    <Form.Control type='number'
                        autoComplete="off"
                        placeholder={t('fooditem_salt')}
                        value={salt}
                        onChange={(e) => setSalt(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFoodItemForm-Fiber">
                    <Form.Label>{t('fooditem_fiber')}</Form.Label>
                    <Form.Control type='number'
                        autoComplete="off"
                        placeholder={t('fooditem_fiber')}
                        value={fiber}
                        onChange={(e) => setFiber(e.target.value)} />
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button type="button" text={t('button_close')} className='btn btn-block' onClick={() => onClose()} />
                        <Button type='submit' text={t('button_save_fooditem')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
        </>
    )
}

export default AddFoodItem
