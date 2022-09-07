import { useState, useEffect } from 'react';
import { Form, Table, ButtonGroup, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import { ref, onValue } from "firebase/database";
import GoBackButton from '../GoBackButton';
import Button from '../Button';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import PageTitle from '../PageTitle';
import Alert from '../Alert';
import PageContentWrapper from '../PageContentWrapper';
import { pushToFirebaseById } from '../../datatier/datatier';

const BmiCalculator = () => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BMICALCULATOR, { keyPrefix: Constants.TRANSLATION_BMICALCULATOR });

    //navigation
    const navigate = useNavigate();

    //user
    const { currentUser } = useAuth();

    //states
    const [BMI, setBMI] = useState(0);
    const [height, setHeight] = useState();
    const [weight, setWeight] = useState();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //load data
    useEffect(() => {
        let isMounted = true;
        const getProfile = async () => {
            if (isMounted) {
                await fetchProfileFromFirebase();
            }
        }
        getProfile();
        return () => { isMounted = false };
    }, [])

    const fetchProfileFromFirebase = async () => {
        const dbref = ref(db, `${Constants.DB_PROFILES}/${currentUser.uid}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                setHeight(data["height"]);
            }
        })
    }

    async function onSubmit(e) {
        e.preventDefault();

        setShowError(false);
        setShowMessage(false);
        setError('');
        setMessage('');

        //validation
        if (height <= 0 || height === undefined) {
            setShowError(true);
            setError(t('please_give_height'));
            return;
        }
        if (weight <= 0 || weight === undefined) {
            setShowError(true);
            setError(t('please_give_weight'));
            return;
        }

        let bmi = calculateBMI();
        setBMI(bmi);

        if (bmi === 0 || isNaN(bmi)) {
            setError(t('bmi_is_zero'));
            setShowError(true);
        } else {
            setMessage(t('your_bmi_is') + ': ' + bmi);
            setShowMessage(true);
            saveWeightToFirebase(weight, bmi);
        }
    }

    const calculateBMI = () => {
        let BMITemp = 0;
        let heightInMeters = height / 100;
        BMITemp = weight / (heightInMeters * heightInMeters);
        let BMIRounded = Math.round(BMITemp * 10) / 10;
        return BMIRounded;
    }

    const saveWeightToFirebase = async (weight, bmi) => {
        let currentDateTime = getCurrentDateAsJson();
        pushToFirebaseById(Constants.DB_WEIGHT_HISTORY, currentUser.uid, { weight, currentDateTime, bmi });
    }

    return (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName='weight'
                        color="#545454"
                        text={t('button_weight_history')}
                        onClick={() => navigate('/weighthistory')} />
                </ButtonGroup>
            </Row>

            <PageTitle title={t('title')} />

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='primary' onClose={() => { setShowMessage(false); setShowError(false); }} />

            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="bmiCalculatorForm-Height">
                    <Form.Label>{t('height')}</Form.Label>
                    <Form.Control type='number' step='any' placeholder={t('height')} value={height}
                        onChange={(e) => setHeight(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="bmiCalculatorForm-Weight">
                    <Form.Label>{t('weight')}</Form.Label>
                    <Form.Control type='number' step='any' placeholder={t('weight')} value={weight}
                        onChange={(e) => setWeight(e.target.value)} />
                </Form.Group>
                <Button type='submit' text={t('calculate_bmi')} className='btn btn-block' />
            </Form>

            <Table>
                <tbody>
                    <tr>
                        <td>{t('bmi_1')}</td>
                        <td>0 - 14,9</td>
                    </tr>
                    <tr>
                        <td>{t('bmi_2')}</td>
                        <td>15 - 17,9</td>
                    </tr>
                    <tr>
                        <td>{t('bmi_3')}</td>
                        <td>18 - 18,9</td>
                    </tr>
                    <tr>
                        <td>{t('bmi_4')}</td>
                        <td>19 - 24,9</td>
                    </tr>
                    <tr>
                        <td>{t('bmi_5')}</td>
                        <td>25,0 - 29,9</td>
                    </tr>
                    <tr>
                        <td>{t('bmi_6')}</td>
                        <td>30,0 - 34,9</td>
                    </tr>
                    <tr>
                        <td>{t('bmi_7')}</td>
                        <td>35,0 - 39,9</td>
                    </tr>
                    <tr>
                        <td>{t('bmi_8')}</td>
                        <td>40,0 {t('bmi_ormore')}</td>
                    </tr>
                </tbody>
            </Table>
        </PageContentWrapper>
    )
}

export default BmiCalculator