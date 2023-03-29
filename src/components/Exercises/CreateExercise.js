import { Form, Row, Col, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import GoBackButton from '../GoBackButton';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentDateAsJson, getCurrentDate, getCurrentTime } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import { Categories, ExerciseCategories } from './Categories';
import PageTitle from '../Site/PageTitle';
import Alert from '../Alert';
import PageContentWrapper from '../Site/PageContentWrapper';
import { pushToFirebase } from '../../datatier/datatier';

const CreateExercise = () => {

    //states
    const [category, setCategory] = useState();
    const [categories, setCategories] = useState(ExerciseCategories);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('');
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
        setDefaultCategory();
    }, [ready])

    const setDefaultCategory = () => {
        //set default category to gym
        let obj = categories.find(x => x.id === Categories.Gym);
        setCategory(obj.id);
    }

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

    const saveExercise = async (exercise) => {
        try {
            exercise["created"] = getCurrentDateAsJson();
            exercise["createdBy"] = currentUser.email;
            const key = await pushToFirebase(Constants.DB_EXERCISES, exercise);
            navigate(`${Constants.NAVIGATION_EXERCISE}/${key}`);
        } catch (ex) {
            setError(t('exercise_save_exception'));
            setShowError(true);
        }
    }

    return (
        <PageContentWrapper>
            <ButtonGroup>
                <GoBackButton />
            </ButtonGroup>
            <PageTitle title={t('create_exercise')} />

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

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
                        <Form.Control type="date" name='date' onChange={(e) => setDate(e.target.value)} value={date} />
                    </Form.Group>
                    <Form.Group as={Col} className="mb-3">
                        <Form.Label>{t('date_and_time')}</Form.Label>
                        <Form.Control type="time" name='time' onChange={(e) => setTime(e.target.value)} value={time} />
                    </Form.Group>
                </Row>
                <Button type='submit' text={t('button_create_exercise')} className='btn btn-block saveBtn' />
            </Form>
        </PageContentWrapper>
    )
}

export default CreateExercise
