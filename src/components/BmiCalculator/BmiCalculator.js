import { useState, useEffect } from 'react';
import GoBackButton from '../GoBackButton';
import { ButtonGroup, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Form, Table } from 'react-bootstrap';
import Button from '../Button';
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase-config';
import { ref, push, onValue } from "firebase/database";
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';

const BmiCalculator = () => {

    const { t } = useTranslation('bmicalculator', {keyPrefix:'bmicalculator'});
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    //states
    const [BMI, setBMI] = useState(0)
    const [weight, setWeight] = useState(0)
    const [height, setHeight] = useState(0)
    const [profile, setProfile] = useState({})

    //load data
    useEffect(() => {
        let isMounted = true;
        const getProfile = async () => {
            if (isMounted)
                await fetchProfileFromFirebase();
        }
        getProfile()
        return () => { isMounted = false };
    }, [])

    /** Fetch Profile From Firebase */
    const fetchProfileFromFirebase = async () => {
        const dbref = ref(db, '/profiles/' + currentUser.uid);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                setProfile(data);
                setHeight(data["height"]);
            }
        })
    }

    async function onSubmit(e) {
        e.preventDefault()

        let bmi = calculateBMI();
        setBMI(bmi);

        saveWeightToFirebase(weight, bmi)
    }

    const calculateBMI = () => {
        let BMITemp = 0;
        let heightInMeters = height / 100;
        BMITemp = weight / (heightInMeters * heightInMeters);
        let BMIRounded = Math.round(BMITemp * 10) / 10;
        return BMIRounded;
    }

    /** Save Given Weight and BMI To Firebase for this user */
    const saveWeightToFirebase = async (weight, bmi) => {
        const dbref = ref(db, '/weighthistory/' + currentUser.uid);
        let currentDateTime = getCurrentDateAsJson();
        push(dbref, { weight, currentDateTime, bmi });
    }

    return (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        color="#545454"
                        text={t('button_weight_history')}
                        onClick={() => navigate('/weighthistory')} />
                </ButtonGroup>
            </Row>
            <h3 className="page-title">{t('title')}</h3>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addTaskFormTaskName">
                    <Form.Label>{t('height')}</Form.Label>
                    <Form.Control type='number' placeholder={t('height')} value={height} onChange={(e) => setHeight(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addTaskFormTaskName">
                    <Form.Label>{t('weight')}</Form.Label>
                    <Form.Control type='number' placeholder={t('weight')} value={weight} onChange={(e) => setWeight(e.target.value)} />
                </Form.Group>
                <Button type='submit' text={t('calculate_bmi')} className='btn btn-block' />
            </Form>
            {BMI > 0 &&
                <div className="alert alert-primary">
                    {t('your_bmi_is')} : {BMI}
                </div>
            }
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
        </div>
    )
}

export default BmiCalculator