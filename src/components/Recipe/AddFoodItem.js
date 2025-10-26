import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import Button from '../Buttons/Button';
import { FoodItemCategories } from './Categories';
import { TRANSLATION, DB } from '../../utils/Constants';
import useFetchById from '../Hooks/useFetchById';

export default function AddFoodItem({ foodItemID, onAddFoodItem, onClose }) {

    const { t, ready } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    const defaultFoodItem = {
        name: '',
        category: '',
        haveAtHome: false,
        calories: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        protein: 0,
        salt: 0,
        sugars: 0,
        created: '',
        createdBy: ''
    };

    const [foodItem, setFoodItem] = useState(defaultFoodItem);

    const foodItemData = useFetchById(DB.FOODITEMS, foodItemID);

    useEffect(() => {
        if (foodItemData) {
            setFoodItem(prev => ({
                ...prev,
                ...foodItemData
            }));
        }
    }, [foodItemData]);

    const sortedCategories = useMemo(() => {
        return [...FoodItemCategories].sort((a, b) => {
            const aName = t(`fooditem_category_${a.name}`);
            const bName = t(`fooditem_category_${b.name}`);
            return aName.localeCompare(bName);
        });
    }, [ready, t]);

    const handleChange = (key, value) => {
        setFoodItem(prev => ({ ...prev, [key]: value }));
    };

    const nutritionFields = [
        { key: 'calories', label: 'fooditem_calories' },
        { key: 'fat', label: 'fooditem_fat' },
        { key: 'carbs', label: 'fooditem_carbs' },
        { key: 'sugars', label: 'fooditem_sugars' },
        { key: 'protein', label: 'fooditem_protein' },
        { key: 'salt', label: 'fooditem_salt' },
        { key: 'fiber', label: 'fooditem_fiber' }
    ];

    const onSubmit = (e) => {
        e.preventDefault();

        if (!foodItem.name.trim()) {
            alert(t('fooditem_please_add_name'));
            return;
        }

        onAddFoodItem(foodItem);

        if (foodItemID === null) {
            setFoodItem(defaultFoodItem);
        }
    };

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addFoodItemForm-Name">
                <Form.Label>{t('fooditem_name')}</Form.Label>
                <Form.Control
                    type='text'
                    autoComplete="off"
                    placeholder={t('fooditem_name')}
                    value={foodItem.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3" controlId="addFoodItemForm-Category">
                <Form.Label>{t('fooditem_category')}</Form.Label>
                <Form.Select
                    value={foodItem.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                >
                    {sortedCategories.map(({ id, name }) => (
                        <option key={id} value={id}>
                            {t(`fooditem_category_${name}`)}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            {/* Generoidaan ravintoarvokentät */}
            {nutritionFields.map(({ key, label }) => (
                <Form.Group key={key} className="mb-3" controlId={`addFoodItemForm-${key}`}>
                    <Form.Label>{t(label)}</Form.Label>
                    <Form.Control
                        type='number'
                        autoComplete="off"
                        step="any"
                        placeholder={t(label)}
                        value={foodItem[key]}
                        onChange={(e) => handleChange(key, Number(e.target.value))}
                    />
                </Form.Group>
            ))}

            <Form.Group className="mb-3" controlId="addFoodItemForm-HaveAtHome">
                <Form.Check
                    type='checkbox'
                    label={t('fooditem_have_at_home')}
                    checked={foodItem.haveAtHome}
                    onChange={(e) => handleChange('haveAtHome', e.currentTarget.checked)}
                />
            </Form.Group>

            <Row>
                <ButtonGroup>
                    <Button
                        type="button"
                        text={tCommon('buttons.button_close')}
                        className='btn btn-block'
                        onClick={onClose}
                    />
                    <Button
                        type='submit'
                        text={t('button_save_fooditem')}
                        className='btn btn-block saveBtn'
                    />
                </ButtonGroup>
            </Row>
        </Form>
    );
}
