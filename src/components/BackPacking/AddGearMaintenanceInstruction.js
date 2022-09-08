import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../Button';
import * as Constants from "../../utils/Constants";
import { getFromFirebaseById } from '../../datatier/datatier';

const AddGearMaintenanceInstruction = ({ gearMaintenanceInstructionID, onSave, onClose }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BACKPACKING, { keyPrefix: Constants.TRANSLATION_BACKPACKING });

    //states
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [text, setText] = useState('');
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

        getFromFirebaseById(Constants.DB_GEAR_MAINTENANCE_INSTRUCTIONS, gearMaintenanceInstructionID)
            .then((val) => {
                setCreated(val["created"]);
                setCreatedBy(val["createdBy"]);
                setName(val["name"]);
                setStars(val["stars"]);
                setText(val["text"]);
            });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_gear_maintenance_instruction_name'));
            return;
        }

        onSave({ created, createdBy, name, stars, text });

        if (gearMaintenanceInstructionID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setName('');
        setText('');
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
                    <Form.Control as="textarea" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
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
