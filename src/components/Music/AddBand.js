import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../Buttons/Button';
import { TRANSLATION, DB } from "../../utils/Constants";
import PropTypes from 'prop-types';
import useFetchById from '../Hooks/useFetchById';

export default function AddBand({ bandID, onSave, onClose, showLabels }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //states
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [formingYear, setFormingYear] = useState(0);
    const [seenLive, setSeenLive] = useState(false);
    const [country, setCountry] = useState('');
    const [stars, setStars] = useState(0);

    //load data
    const bandData = useFetchById(DB.MUSIC_BANDS, bandID);

    useEffect(() => {
        if (bandData) {
            setCreated(bandData.created || '');
            setCreatedBy(bandData.createdBy || '');
            setDescription(bandData.description || '');
            setName(bandData.name || '');
            setFormingYear(bandData.formingYear || 0);
            setSeenLive(bandData.seenLive || false);
            setCountry(bandData.country || '');
            setStars(bandData.stars || 0);
        }
    }, [bandData]);

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_name'));
            return;
        }

        onSave(bandID, {
            created, createdBy, description, name, formingYear, seenLive, country, stars
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
                        <Button type='button' text={tCommon('buttons.button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button type='submit' text={tCommon('buttons.button_save')} className='btn btn-block saveBtn' />
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
