//buttons
import Button from "../Button";
//react
import { useTranslation } from 'react-i18next';
import { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";

function AddPartsGymForm({ exerciseID, onAddPart }) {

    //translation  
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

    //states
    const [name, setName] = useState('');
    /** Painojen määrä */
    const [weight, setWeight] = useState(0);
    const [repeat, setRepeat] = useState(0);

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            return;
        }

        onAddPart(exerciseID, { name, weight, repeat })

        clearForm();
    }

    const clearForm = () => {
        setName('');
        setWeight(0);
        setRepeat(0);
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
            <Row>
                <Form.Group as={Col} className="mb-3" className="mb-3" controlId="addPartsGymForm-Weight">
                    <Form.Label>{t('gym_part_weight')}</Form.Label>
                    <Form.Control
                        autoComplete="off"
                        type='number'
                        placeholder={t('gym_part_weight')}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)} />
                </Form.Group>
                <Form.Group as={Col} className="mb-3" className="mb-3" controlId="addPartsGymForm-Repeat">
                    <Form.Label>{t('gym_part_repeat')}</Form.Label>
                    <Form.Control
                        autoComplete="off"
                        type='text'
                        placeholder={t('gym_part_repeat')}
                        value={repeat}
                        onChange={(e) => setRepeat(e.target.value)} />
                </Form.Group>
            </Row>
            <Button type='submit' text={t('button_save_gym_part')} className='btn btn-block saveBtn' />
        </Form>
    )
}

export default AddPartsGymForm