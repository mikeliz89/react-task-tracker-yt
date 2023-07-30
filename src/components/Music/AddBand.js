import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form, Col } from 'react-bootstrap';
import Button from '../Buttons/Button';
import * as Constants from "../../utils/Constants";
import { getFromFirebaseById } from '../../datatier/datatier';
import PropTypes from 'prop-types';

const AddBand = ({ bandID, onSave, onClose, showLabels }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //states
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [formingYear, setFormingYear] = useState(0);
    const [seenLive, setSeenLive] = useState(false);
    const [country, setCountry] = useState('');

    //load data
    useEffect(() => {
        if (bandID != null) {
            const getBand = async () => {
                await fetchBandFromFirebase(bandID);
            }
            getBand();
        }
    }, [bandID]);

    const fetchBandFromFirebase = async (bandID) => {
        getFromFirebaseById(Constants.DB_MUSIC_BANDS, bandID).then((val) => {
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
            setDescription(val["description"]);
            setName(val["name"]);
            setFormingYear(val["formingYear"]);
            setSeenLive(val["seenLive"]);
            setCountry(val["country"]);
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_name'));
            return;
        }

        onSave(bandID, {
            created, createdBy, description, name, formingYear, seenLive, country
        });

        if (bandID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setDescription('');
        setName('');
        setCountry('');
        setFormingYear(0);
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                {/* Tapahtuman nimi */}
                <Form.Group className="mb-3" controlId="addBandForm-Name">
                    {showLabels && <Form.Label>{t('band_name')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('band_name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addBandForm-Description">
                    {showLabels && <Form.Label>{t('description')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('description')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addBandForm-FormingYear">
                    {showLabels && <Form.Label>{t('band_forming_year')}</Form.Label>}
                    <Form.Control type='number' step='any'
                        autoComplete="off"
                        placeholder={t('band_forming_year')}
                        value={formingYear}
                        onChange={(e) => setFormingYear(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addBandForm-Country">
                    {showLabels && <Form.Label>{t('country')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('country')}
                        value={country}
                        onChange={(e) => setCountry(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addBandForm-SeenLive">
                    <Form.Check
                        type='checkbox'
                        label={t('seen_live')}
                        checked={seenLive}
                        value={seenLive}
                        onChange={(e) => setSeenLive(e.currentTarget.checked)} />
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button type='button' text={t('button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button type='submit' text={t('button_save_band')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
        </>
    )
}

AddBand.defaultProps = {
    showLabels: true
}

AddBand.propTypes = {
    showLabels: PropTypes.bool
}

export default AddBand
