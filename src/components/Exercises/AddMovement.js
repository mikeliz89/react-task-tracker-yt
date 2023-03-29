import { Row, Form, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import { MovementCategories } from './Categories';
import PageTitle from '../Site/PageTitle';
import Alert from '../Alert';
import { getFromFirebaseById, pushToFirebase, updateToFirebaseById } from '../../datatier/datatier';

const AddMovement = ({ movementID, onClose }) => {

    //states
    const [category, setCategory] = useState();
    const [categories, setCategories] = useState(MovementCategories);
    const [name, setName] = useState('');
    const [created, setCreated] = useState();
    const [createdBy, setCreatedBy] = useState();
    const [stars, setStars] = useState(0);
    const [description, setDescription] = useState('');

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //translation
    const { t, ready } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

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
            return;
        }

        const obj = { name, category, stars, description };
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
            const key = await pushToFirebase(Constants.DB_EXERCISE_MOVEMENTS, movement);
            navigate(`${Constants.NAVIGATION_MOVEMENT}/${key}`); //TODO: Constants.Navigation.
        } catch (ex) {
            setError(t('movement_save_exception'));
            setShowError(true);
        }
    }

    const updateMovement = async (movement) => {
        movement["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(Constants.DB_EXERCISE_MOVEMENTS, movementID, movement);
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
                <Form.Group className="mb-3" controlId="addMovementForm-Description">
                    <Form.Label>{t('description')}</Form.Label>
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('description')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
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
