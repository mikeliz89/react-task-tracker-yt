import { useState, useEffect } from 'react';
import { Row, ButtonGroup, Form, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION, DB } from "../../utils/Constants";
import Button from '../Buttons/Button';
import useFetchById from '../Hooks/useFetchById';

const RELATIONSHIP_KEYS = ['family', 'partner', 'relative', 'friend', 'coworker', 'neighbor', 'other'];

const getRelationshipLabelFromKey = (key, t) => {
    if (key === 'family') return t('relationship_family');
    if (key === 'partner') return t('relationship_partner');
    if (key === 'relative') return t('relationship_relative');
    if (key === 'friend') return t('relationship_friend');
    if (key === 'coworker') return t('relationship_coworker');
    if (key === 'neighbor') return t('relationship_neighbor');
    if (key === 'other') return t('relationship_other');
    return key;
};

export default function AddPerson({ personID, onSave, onClose, showLabels = true }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.PEOPLE });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //states
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [relationship, setRelationship] = useState('');
    const [relationshipPicker, setRelationshipPicker] = useState('');
    const [birthday, setBirthday] = useState(new Date());
    const [address, setAddress] = useState('');
    const [stars, setStars] = useState(0);

    //load data
    const personData = useFetchById(DB.PEOPLE, personID);

    useEffect(() => {
        if (personData) {
            setAddress(personData.address || '');
            setCreated(personData.created || '');
            setCreatedBy(personData.createdBy || '');
            setDescription(personData.description || '');
            const relationshipFromData = personData.relationship || '';
            const relationshipText = RELATIONSHIP_KEYS.includes(relationshipFromData)
                ? getRelationshipLabelFromKey(relationshipFromData, t)
                : relationshipFromData;
            setRelationship(relationshipText);
            setName(personData.name || '');
            setBirthday(personData.birthday || '');
            setStars(personData.stars || 0);
        }
    }, [personData, t]);

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_name'));
            return;
        }


        const payload = {
            address,
            created,
            createdBy,
            description,
            relationship,
            name,
            birthday,
            stars
        };

        onSave(personID, payload);

        if (personID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setAddress('');
        setDescription('');
        setRelationship('');
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
                <Form.Group className="mb-3" controlId="addPersonForm-Relationship">
                    {showLabels && <Form.Label>{t('relationship')}</Form.Label>}
                    <Form.Control
                        type='text'
                        autoComplete="off"
                        placeholder={t('relationship')}
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                    />
                    <Form.Select
                        className="mt-2"
                        value={relationshipPicker}
                        onChange={(e) => {
                            const selected = e.target.value;
                            setRelationshipPicker(selected);
                            if (selected) {
                                setRelationship(getRelationshipLabelFromKey(selected, t));
                                setRelationshipPicker('');
                            }
                        }}>
                        <option value="">{t('relationship_quick_pick')}</option>
                        <option value="family">{t('relationship_family')}</option>
                        <option value="partner">{t('relationship_partner')}</option>
                        <option value="relative">{t('relationship_relative')}</option>
                        <option value="friend">{t('relationship_friend')}</option>
                        <option value="coworker">{t('relationship_coworker')}</option>
                        <option value="neighbor">{t('relationship_neighbor')}</option>
                        <option value="other">{t('relationship_other')}</option>
                    </Form.Select>
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
        </>
    )
}


