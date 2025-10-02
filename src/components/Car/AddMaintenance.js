import { ButtonGroup, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Button from '../Buttons/Button';
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase-config";
import * as Constants from '../../utils/Constants';
import FormTitle from '../Site/FormTitle';

export default function AddMaintenance({ ID, onClose, onSave }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_CAR });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, {keyPrefix: Constants.TRANSLATION_COMMON});

    //states
    const [loading] = useState(false);

    //car data states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');

    //loadData
    useEffect(() => {
        if (ID != null) {
            const getMaintenance = async () => {
                await fetchMaintenanceFromFirebase(ID);
            }
            getMaintenance();
        }
    }, [ID]);

    const fetchMaintenanceFromFirebase = async (ID) => {
        const dbref = ref(db, `${Constants.DB_CAR_MAINTENANCE}/${ID}`);
        onValue(dbref, (snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                setCreated(val["created"]);
                setCreatedBy(val["createdBy"]);
                setName(val["name"]);
                setDescription(val["description"]);
                setPrice(val["price"]);
            }
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        const maintenance = {
            created, createdBy,
            name, description,
            price
        };
        onSave(maintenance);

        if (ID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setName('');
        setDescription('');
        setPrice(0);
    }

    return (
        <div>
            <FormTitle title={t('add_maintenance_title')} />

            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addMaintenanceForm-MaintenanceName">
                    <Form.Label>{t('maintenance_name')}</Form.Label>
                    <Form.Control
                        autoComplete="off"
                        type='text' placeholder={t('maintenance_name')}
                        value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addMaintenanceForm-MaintenanceDescription">
                    <Form.Label>{t('maintenance_description')}</Form.Label>
                    <Form.Control
                        autoComplete="off"
                        type='text' placeholder={t('maintenance_description')}
                        value={description} onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addMaintenanceForm-MaintenancePrice">
                    <Form.Label>{t('maintenance_price')}</Form.Label>
                    <Form.Control type='number' placeholder={t('maintenance_price')}
                        value={price} onChange={(e) => setPrice(e.target.value)} />
                </Form.Group>

                <Row>
                    <ButtonGroup>
                        <Button
                            type='button' text={t('button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button disabled={loading} type='submit' text={t('save')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
        </div >
    )
}