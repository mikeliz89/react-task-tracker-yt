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
import { ExerciseCategories } from './Categories';
import PageTitle from '../PageTitle';

const CreateExercise = () => {

    //constants
    const DB_EXERCISES = '/exercises';

    //states
    const [category, setCategory] = useState();
    const [categories, setCategories] = useState(ExerciseCategories);
    const [date, setDate] = useState(''); //todo: laita oletuksena nykypvm
    const [time, setTime] = useState(''); //todo: laita oletuksena nykyinen kellonaika
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
            const aName = t(`category_${a.name}`);
            const bName = t(`category_${b.name}`);
            return aName > bName ? 1 : -1;
        });
        setCategories(sortedCategories);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!date) {
            return;
        }

        saveExercise({ date, time, category });
    }

    /** Add Exercise To Firebase */
    const saveExercise = async (exercise) => {
        try {
            exercise["created"] = getCurrentDateAsJson();
            exercise["createdBy"] = currentUser.email;
            const dbref = ref(db, DB_EXERCISES);
            push(dbref, exercise).then((snap) => {
                const key = snap.key;
                navigate('/exercise/' + key);
            })
        } catch (ex) {
            setError(t('exercise_save_exception'));
        }
    }

    return (
        <>
            <ButtonGroup>
                <GoBackButton />
            </ButtonGroup>
            <PageTitle title={t('create_exercise')} />
            {error && <div className="error">{error}</div>}
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="createExerciseForm-Category">
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
