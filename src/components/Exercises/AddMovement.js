//react
import { Row, Form, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//firebase
import { db } from '../../firebase-config';
import { get, ref, push, update } from 'firebase/database';
//buttons
import Button from '../Button';
import GoBackButton from '../GoBackButton';
//auth
import { useAuth } from '../../contexts/AuthContext';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//Categories
import { MovementCategories } from './Categories';
//pagetitle
import PageTitle from '../PageTitle';
//alert
import Alert from '../Alert';

const AddMovement = ({ movementID, onClose }) => {

    const DB_MOVEMENTS = '/exercise-movements';

    //states
    const [category, setCategory] = useState();
    const [categories, setCategories] = useState(MovementCategories);
    const [name, setName] = useState('');
    const [created, setCreated] = useState();
    const [createdBy, setCreatedBy] = useState();
    const [stars, setStars] = useState(0);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
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

    useEffect(() => {
        if (movementID != null) {
            const getMovement = async () => {
                await fetchMovementFromFirebase(movementID);
            }
            getMovement();
        }
    }, [movementID]);

    const fetchMovementFromFirebase = async (movementID) => {

        const dbref = ref(db, `${DB_MOVEMENTS}/${movementID}`);
        get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                setName(val["name"]);
                setCreated(val["created"]);
                setCreatedBy(val["createdBy"]);
                setCategory(val["category"]);
                setStars(val["stars"]);
            }
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
            return;
        }

        const obj = { name, category, stars };
        if (movementID === undefined) {
            addMovement(obj);
        } else {
            updateMovement(obj);
        }
    }

    const addMovement = async (movement) => {
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
            setShowError(true);
        }
    }

    const updateMovement = async (movement) => {
        const updates = {};
        movement["modified"] = getCurrentDateAsJson();
        updates[`${DB_MOVEMENTS}/${movementID}`] = movement;
        update(ref(db), updates);
    }

    return (
        <>
            <ButtonGroup>
                <GoBackButton />
            </ButtonGroup>
            <PageTitle title={movementID === undefined ? t('add_movement') : t('edit_movement')} />

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

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
                {movementID != undefined &&
                    <Row>
                        <ButtonGroup>
                            <Button type='button' text={t('button_close')} onClick={() => onClose()} className='btn btn-block' />
                            <Button type='submit' text={t('button_add_movement')} className='btn btn-block saveBtn' />
                        </ButtonGroup>
                    </Row>
                }
                {
                    movementID === undefined &&
                    <Button type='submit' text={t('button_add_movement')} className='btn btn-block saveBtn' />
                }
            </Form>
        </>
    )
}

export default AddMovement
