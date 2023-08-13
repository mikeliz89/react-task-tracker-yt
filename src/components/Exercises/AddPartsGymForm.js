import Button from '../Buttons/Button';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react";
import { Form, Row, Col, ButtonGroup } from "react-bootstrap";
import * as Constants from '../../utils/Constants';
import { getFromFirebaseByIdAndSubId } from "../../datatier/datatier";

export default function AddPartsGymForm({ exerciseID, gymPartID, onSave, onClose }) {

    //translation  
    const { t } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

    //states
    const [name, setName] = useState('');
    /** Painojen määrä */
    const [weight, setWeight] = useState(0); //painot
    const [repeat, setRepeat] = useState(0); //toistot
    const [series, setSeries] = useState(1); //sarjoja

    useEffect(() => {
        console.log(gymPartID);
        if (gymPartID != null) {
            const getGymPart = async () => {
                await fetchGymPartFromFirebase(gymPartID);
            }
            getGymPart();
        }
    }, [gymPartID]);

    const fetchGymPartFromFirebase = async (gymPartID) => {


        getFromFirebaseByIdAndSubId(Constants.DB_EXERCISE_PARTS, exerciseID, gymPartID).then((val) => {
            setName(val["name"]);
            setWeight(val["weight"]);
            setRepeat(val["repeat"]);
            setSeries(val["series"]);
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_exercise_name'));
            return;
        }

        onSave(exerciseID, { name, weight, repeat, series })

        clearForm();
    }

    const clearForm = () => {
        setName('');
        setRepeat(0);
        setSeries(0);
        setWeight(0);
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addPartsGymForm-Name">
                <Form.Label>{t('gym_part_name')}</Form.Label>
                <Form.Control
                    autoComplete="off"
                    type='text'
                    placeholder={t('gym_part_name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addPartsGymForm-Name">
                <Form.Label>{t('gym_part_series')}</Form.Label>
                <Form.Control
                    autoComplete="off"
                    type='number'
                    placeholder={t('gym_part_series')}
                    value={series}
                    onChange={(e) => setSeries(e.target.value)} />
            </Form.Group>
            <Row>
                <Form.Group as={Col} className="mb-3" controlId="addPartsGymForm-Weight">
                    <Form.Label>{t('gym_part_weight')}</Form.Label>
                    <Form.Control
                        autoComplete="off"
                        type='number'
                        placeholder={t('gym_part_weight')}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)} />
                </Form.Group>
                <Form.Group as={Col} className="mb-3" controlId="addPartsGymForm-Repeat">
                    <Form.Label>{t('gym_part_repeat')}</Form.Label>
                    <Form.Control
                        autoComplete="off"
                        type='text'
                        placeholder={t('gym_part_repeat')}
                        value={repeat}
                        onChange={(e) => setRepeat(e.target.value)} />
                </Form.Group>
            </Row>
            <Row>
                <ButtonGroup>
                    <Button type='button' text={t('close')} className='btn btn-block' onClick={() => onClose()} />
                    <Button type='submit' text={t('button_save_gym_part')} className='btn btn-block saveBtn' />
                </ButtonGroup>
            </Row>
        </Form>
    )
}