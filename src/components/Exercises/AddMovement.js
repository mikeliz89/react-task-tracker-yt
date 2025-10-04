import { Row, Form, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Button from '../Buttons/Button';
import * as Constants from '../../utils/Constants';
import { MovementCategories } from './Categories';
import { getFromFirebaseById } from '../../datatier/datatier';

export default function  AddMovement ({ movementID, onClose, onSave })  {

    //states
    const [category, setCategory] = useState();
    const [categories, setCategories] = useState(MovementCategories);
    const [name, setName] = useState('');
    const [setCreated] = useState();
    const [setCreatedBy] = useState();
    const [stars, setStars] = useState(0);
    const [description, setDescription] = useState('');

    //translation
    const { t, ready } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_EXERCISES });

    useEffect(() => {
        sortCategoriesByName();
    }, [ready]);

    useEffect(() => {
        if (movementID != null) {
            const getMovement = async () => {
                await fetchMovementFromFirebase(movementID);
            }
            getMovement();
        }
    }, [movementID]);

    const fetchMovementFromFirebase = async (movementID) => {
        getFromFirebaseById(Constants.DB_EXERCISE_MOVEMENTS, movementID).then((val) => {
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
            setCategory(val["category"]);
            setDescription(val["description"]);
            setName(val["name"]);
            setStars(val["stars"]);
        });
    }

    const sortCategoriesByName = () => {
        const sortedCategories = [...categories].sort((a, b) => {
            const aName = t(`movementcategory_${a.name}`);
            const bName = t(`movementcategory_${b.name}`);
            return aName > bName ? 1 : -1;
        });
        setCategories(sortedCategories);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_exercise_name'));
            return;
        }

        const obj = { name, category, stars, description };
        onSave(obj);
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addMovementForm-Category">
                    <Form.Label>{t('movementcategory')}</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                        {categories.map(({ id, name }) => (
                            <option value={id} key={id}>{t(`movementcategory_${name}`)}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="addMovementForm-Name">
                    <Form.Label>{t('name')}</Form.Label>
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addMovementForm-Description">
                    <Form.Label>{t('description')}</Form.Label>
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('description')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button type='button' text={t('button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button type='submit' text={t('button_add_movement')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
        </>
    )
}