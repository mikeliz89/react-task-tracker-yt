//react
import { Form, Row, Col, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
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

const categoriesTemp = [
    {
        "id": 1,
        "name": "running"
    },
    {
        "id": 2,
        "name": "walking"
    },
    {
        "id": 3,
        "name": "gym"
    },
    {
        "id": 4,
        "name": "kayaking"
    }
]

const CreateExercise = () => {

    //states
    const [category, setCategory] = useState();
    const [categories, setCategories] = useState(categoriesTemp);
    const [date, setDate] = useState(''); //todo: laita oletuksena nykypvm
    const [time, setTime] = useState(''); //todo: laita oletuksena nykyinen kellonaika

    //translation
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

    //auth
    const { currentUser } = useAuth();

    //navigation
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!date) {
            return;
        }

        saveExercise({ date, time, category });
    }

    /** Add Recipe To Firebase */
    const saveExercise = async (exercise) => {
        try {
            if (exercise["category"] === t('category_none')) {
                exercise["category"] = '';
            }
            exercise["created"] = getCurrentDateAsJson();
            exercise["createdBy"] = currentUser.email;
            const dbref = ref(db, '/exercises');
            push(dbref, exercise).then((snap) => {
                const key = snap.key;
                navigate('/exercise/' + key);
            })
        } catch (ex) {
            //setError(t('recipe_save_exception'));
        }
    }

    return (
        <>
            <h3 className='page-title'>{t('create_exercise')}</h3>
            <ButtonGroup>
                <GoBackButton />
            </ButtonGroup>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addRecipeFormCategory">
                    <Form.Label>{t('category')}</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                        <option>{t('category_none')}</option>
                        {categories.map(({ id, name }) => (
                            <option key={id}>{t(`category_${name}`)}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Row>
                    <Form.Group as={Col} className="mb-3">
                        <Form.Label>{t('date_and_time')}</Form.Label>
                        <Form.Control type="date" name='date' value={date} onChange={(e) => setDate(e.target.value)} />
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3">
                        <Form.Label>{t('date_and_time')}</Form.Label>
                        <Form.Control type="time" name='time' value={time} onChange={(e) => setTime(e.target.value)} />
                    </Form.Group>
                </Row>
                <Button type='submit' text={t('button_create_exercise')} className='btn btn-block saveBtn' />
            </Form>
        </>
    )
}

export default CreateExercise
