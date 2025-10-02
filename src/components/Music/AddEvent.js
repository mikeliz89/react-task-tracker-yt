import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../Buttons/Button';
import * as Constants from "../../utils/Constants";
import { getFromFirebaseById } from '../../datatier/datatier';
import PropTypes from 'prop-types';

export default function AddEvent({ eventID, onSave, onClose, showLabels }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //states
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [eventYear, setEventYear] = useState(0);

    //load data
    useEffect(() => {
        if (eventID != null) {
            const getEvent = async () => {
                await fetchEventFromFirebase(eventID);
            }
            getEvent();
        }
    }, [eventID]);

    const fetchEventFromFirebase = async (eventID) => {
        getFromFirebaseById(Constants.DB_MUSIC_EVENTS, eventID).then((val) => {
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
            setDescription(val["description"]);
            setName(val["name"]);
            setEventYear(val["eventYear"]);
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_name'));
            return;
        }

        onSave(eventID, {
            created, createdBy, description, name, eventYear
        });

        if (eventID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setDescription('');
        setName('');
        setEventYear(0);
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                {/* Tapahtuman nimi */}
                <Form.Group className="mb-3" controlId="addEventForm-Name">
                    {showLabels && <Form.Label>{t('event_name')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('event_name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addEventForm-EventYear">
                    {showLabels && <Form.Label>{t('event_year')}</Form.Label>}
                    <Form.Control type='number' step='any'
                        autoComplete="off"
                        placeholder={t('event_year')}
                        value={eventYear}
                        onChange={(e) => setEventYear(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addMusicForm-Description">
                    {showLabels && <Form.Label>{t('description')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('description')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button type='button' text={t('button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button type='submit' text={t('button_save_event')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
        </>
    )
}

AddEvent.defaultProps = {
    showLabels: true
}

AddEvent.propTypes = {
    showLabels: PropTypes.bool
}