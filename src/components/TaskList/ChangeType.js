import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Row, Form, ButtonGroup } from 'react-bootstrap';
import Button from '../Buttons/Button';
import { ListTypesArray } from '../../utils/Enums';
import * as Constants from '../../utils/Constants';

export default function ChangeType({ taskList, onSave, onClose }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_TASKLIST });

    //states
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState(ListTypesArray);

    //load data
    useEffect(() => {
        sortCategoriesByName();
    }, []);

    const sortCategoriesByName = () => {
        const sortedCategories = [...categories].sort((a, b) => {
            const aName = t(`category_${a.name}`);
            const bName = t(`category_${b.name}`);
            return aName > bName ? 1 : -1;
        });
        setCategories(sortedCategories);
    }

    useEffect(() => {
        if (taskList != null) {
            setCategory(taskList["listType"]);
        }
    }, [taskList]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (category === 0) {
            delete (taskList["listType"]);
        } else {
            taskList["listType"] = Number(category);
        }
        onSave(taskList);
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="changeTypeForm-Category">
                <Form.Label>{t('category')}</Form.Label>
                <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(({ id, name }) => (
                        <option value={id} key={id}>{t(`category_${name}`)}</option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Row>
                <ButtonGroup>
                    <Button type='button' text={t('button_close')} className='btn btn-block'
                        onClick={() => onClose()} />
                    <Button type='submit' text={t('button_save_list')} className='btn btn-block saveBtn' />
                </ButtonGroup>
            </Row>
        </Form>
    )
}