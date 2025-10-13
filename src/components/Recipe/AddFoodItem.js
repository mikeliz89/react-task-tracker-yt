import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import Button from '../Buttons/Button';
import { FoodItemCategories } from './Categories';
import { TRANSLATION, DB } from '../../utils/Constants';
import useFetchById from '../Hooks/useFetchById';

export default function AddFoodItem({ foodItemID, onAddFoodItem, onClose }) {

    //translation
    const { t, ready } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //states
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState(FoodItemCategories);
    const [name, setName] = useState('');
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [haveAtHome, setHaveAtHome] = useState('');

    //nutrition info
    const [carbs, setCarbs] = useState(0);
    const [calories, setCalories] = useState(0);
    const [fat, setFat] = useState(0);
    const [fiber, setFiber] = useState(0);
    const [protein, setProtein] = useState(0);
    const [salt, setSalt] = useState(0);
    const [sugars, setSugars] = useState(0);

    //load data
    const foodItemData = useFetchById(DB.FOODITEMS, foodItemID);

    useEffect(() => {
        if (foodItemData) {
            setCalories(foodItemData.calories || 0);
            setCarbs(foodItemData.carbs || 0);
            setCategory(foodItemData.category || '');
            setCreated(foodItemData.created || '');
            setCreatedBy(foodItemData.createdBy || '');
            setFat(foodItemData.fat || 0);
            setFiber(foodItemData.fiber || 0);
            setHaveAtHome(foodItemData.haveAtHome || false);
            setName(foodItemData.name || '');
            setProtein(foodItemData.protein || 0);
            setSalt(foodItemData.salt || 0);
            setSugars(foodItemData.sugars || 0);
        }
    }, [foodItemData]);

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
            fat, fiber,
            haveAtHome,
            name, protein, salt,
            sugars
        });

        if (foodItemID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setCalories(0);
        setCarbs(0);
        setCategory('');
        setFat(0);
        setFiber(0);
        setHaveAtHome(false);
        setName('');
        setProtein(0);
        setSalt(0);
        setSugars(0);
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
                <Form.Group className="mb-3" controlId="addFoodItemForm-Fat">
                    <Form.Label>{t('fooditem_fat')}</Form.Label>
                    <Form.Control type='number'
                        autoComplete="off"
                        placeholder={t('fooditem_fat')}
                        value={fat}
                        onChange={(e) => setFat(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFoodItemForm-Carbs">
                    <Form.Label>{t('fooditem_carbs')}</Form.Label>
                    <Form.Control type='number'
                        autoComplete="off"
                        placeholder={t('fooditem_carbs')}
                        value={carbs}
                        onChange={(e) => setCarbs(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFoodItemForm-Sugars">
                    <Form.Label>{t('fooditem_sugars')}</Form.Label>
                    <Form.Control type='number'
                        autoComplete="off"
                        placeholder={t('fooditem_sugars')}
                        value={sugars}
                        onChange={(e) => setSugars(e.target.value)} />
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
                <Form.Group className="mb-3" controlId="addFoodItemForm-HaveAtHome">
                    <Form.Check
                        type='checkbox'
                        label={t('fooditem_have_at_home')}
                        checked={haveAtHome}
                        value={haveAtHome}
                        onChange={(e) => setHaveAtHome(e.currentTarget.checked)} />
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button type="button" text={tCommon('buttons.button_close')} className='btn btn-block' onClick={() => onClose()} />
                        <Button type='submit' text={t('button_save_fooditem')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
        </>
    )
}