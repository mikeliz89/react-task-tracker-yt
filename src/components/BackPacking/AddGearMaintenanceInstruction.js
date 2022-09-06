//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../Button';
//utils
import * as Constants from "../../utils/Constants";

const AddGearMaintenanceInstruction = ({ gearMaintenanceInstructionID, onSave, onClose }) => {

    //translation
    const { t } = useTranslation('backpacking', { keyPrefix: 'backpacking' });

    //states
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [stars, setStars] = useState(0);

    //load data
    useEffect(() => {
        if (gearMaintenanceInstructionID != null) {
            const getGear = async () => {
                await fetchGearFromFirebase(gearMaintenanceInstructionID);
            }
            getGear();
        }
    }, [gearMaintenanceInstructionID]);

    const fetchGearFromFirebase = async (gearMaintenanceInstructionID) => {

        const dbref = ref(db, `${Constants.DB_GEAR_MAINTENANCE_INSTRUCTIONS}/${gearMaintenanceInstructionID}`);
        get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                setCreated(val["created"]);
                setCreatedBy(val["createdBy"]);
                setName(val["name"]);
                setStars(val["stars"]);
            }
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_gear_maintenance_instruction_name'));
            return;
        }

        onSave({ created, createdBy, name, stars });

        if (gearMaintenanceInstructionID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setName('');
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addGearMaintenanceInstructionForm-Name">
                    <Form.Label>{t('gear_name')}</Form.Label>
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={gearMaintenanceInstructionID == null ? t('gear_name') : t('gear_name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addGearMaintenanceInstructionForm-textArea">
                    <Form.Label>{t('gear_maintenance_instruction_text')}</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button type='button' text={t('button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button type='submit' text={t('button_save_gear_maintenance_instruction')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
        </>
    )
}

export default AddGearMaintenanceInstruction
