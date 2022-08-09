//react
import { Form, Row, Col, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//firebase
import { db } from '../../firebase-config';
import { ref, push } from 'firebase/database';
//buttons
import Button from '../Button';
import GoBackButton from '../GoBackButton';
//auth
import { useAuth } from '../../contexts/AuthContext';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//Categories
import { MovementCategories } from './Categories';
import PageTitle from '../PageTitle';

const CreateMovement = () => {

    const DB_MOVEMENTS = '/exercise-movements';

    //states
    const [category, setCategory] = useState();
    const [categories, setCategories] = useState(MovementCategories);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    //translation
    const { t, ready } = useTranslation('exercises', { keyPrefix: 'exercises' });

    //auth
    const { currentUser } = useAuth();

    //navigation
    const navigate = useNavigate();

    useEffect(() => {
        sortCategoriesByName();
    }, [ready]);

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
            return;
        }

        saveMovement({ name, category });
    }

    /** Add Movement To Firebase */
    const saveMovement = async (movement) => {
        try {
            movement["created"] = getCurrentDateAsJson();
            movement["createdBy"] = currentUser.email;
            const dbref = ref(db, DB_MOVEMENTS);
            push(dbref, movement).then((snap) => {
                const key = snap.key;
                navigate('/movement/' + key);
            })
        } catch (ex) {
            setError(t('movement_save_exception'));
        }
    }

    return (
        <>
            <ButtonGroup>
                <GoBackButton />
            </ButtonGroup>
            <PageTitle title={t('create_movement')} />
            {error && <div className="error">{error}</div>}
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="createMovementForm-Category">
                    <Form.Label>{t('movementcategory')}</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                        {categories.map(({ id, name }) => (
                            <option value={id} key={id}>{t(`movementcategory_${name}`)}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="createMovementForm-Name">
                    <Form.Label>{t('name')}</Form.Label>
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Button type='submit' text={t('button_create_movement')} className='btn btn-block saveBtn' />
            </Form>
        </>
    )
}

export default CreateMovement
