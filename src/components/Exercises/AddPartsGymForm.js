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

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            return;
        }

        onAddPart(exerciseID, { name })

        //clear the form
        setName('');
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
            <Button type='submit' text={t('button_save_gym_part')} className='btn btn-block saveBtn' />
        </Form>
    )
}

export default AddPartsGymForm