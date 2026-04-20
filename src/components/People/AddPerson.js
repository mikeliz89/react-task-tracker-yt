import { useState, useEffect } from 'react';
import { Row, ButtonGroup, Form, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION, DB } from "../../utils/Constants";
import Button from '../Buttons/Button';
import useFetchById from '../Hooks/useFetchById';

export default function AddPerson({ personID, onSave, onClose, showLabels = true }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.PEOPLE });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //states
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [birthday, setBirthday] = useState(new Date());
    const [address, setAddress] = useState('');

    //load data
    const personData = useFetchById(DB.PEOPLE, personID);

    useEffect(() => {
        if (personData) {
            setAddress(personData.address || '');
            setCreated(personData.created || '');
            setCreatedBy(personData.createdBy || '');
            setDescription(personData.description || '');
            setName(personData.name || '');
            setBirthday(personData.birthday || '');
        }
    }, [personData]);

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
                    {showLabels && <Form.Label>{t('name')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addPersonForm-Description">
                    {showLabels && <Form.Label>{t('description')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('description')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addPersonForm-Address">
                    {showLabels && <Form.Label>{t('address')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('address')}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)} />
                </Form.Group>
                <Form.Group as={Col} className="mb-3" controlId="addPersonForm-BirthDay">
                    {showLabels && <Form.Label>{t('birthday')}</Form.Label>}
                    <Form.Control type="date" name='date' onChange={(e) => setBirthday(e.target.value)} value={birthday} />
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button type='button' text={tCommon('buttons.button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button type='submit' text={tCommon('buttons.button_save')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
            {/* TODO rakenna linkin lisäys jo personin lisäykseen <AddLink onSaveLink={saveLink} /> */}
        </>
    )
}


