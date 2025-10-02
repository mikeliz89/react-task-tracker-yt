import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form, Col } from 'react-bootstrap';
import Button from '../Buttons/Button';
import * as Constants from "../../utils/Constants";
import { getFromFirebaseById } from '../../datatier/datatier';

export default function AddPerson({ personID, onSave, onClose }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_PEOPLE });

    //states
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [birthday, setBirthday] = useState(new Date());
    const [address, setAddress] = useState('');

    //load data
    useEffect(() => {
        if (personID != null) {
            const getPerson = async () => {
                await fetchPersonFromFirebase(personID);
            }
            getPerson();
        }
    }, [personID]);

    const fetchPersonFromFirebase = async (personID) => {
        getFromFirebaseById(Constants.DB_PEOPLE, personID).then((val) => {
            setAddress(val["address"]);
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
            setDescription(val["description"]);
            setName(val["name"]);
            setBirthday(val["birthday"]);
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_name'));
            return;
        }

        onSave({ address, created, createdBy, description, name, birthday });

        if (personID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setAddress('');
        setDescription('');
        setName('');
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addPersonForm-Name">
                    <Form.Label>{t('name')}</Form.Label>
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addPersonForm-Description">
                    <Form.Label>{t('description')}</Form.Label>
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('description')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addPersonForm-Address">
                    <Form.Label>{t('address')}</Form.Label>
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('address')}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)} />
                </Form.Group>
                <Form.Group as={Col} className="mb-3" controlId="addPersonForm-BirthDay">
                    <Form.Label>{t('birthday')}</Form.Label>
                    <Form.Control type="date" name='date' onChange={(e) => setBirthday(e.target.value)} value={birthday} />
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button type='button' text={t('button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button type='submit' text={t('button_save_person')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
            {/* TODO rakenna linkin lisäys jo personin lisäykseen <AddLink onSaveLink={saveLink} /> */}
        </>
    )
}