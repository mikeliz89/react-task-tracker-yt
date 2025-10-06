import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../Buttons/Button';
import * as Constants from "../../utils/Constants";
import { getFromFirebaseById } from '../../datatier/datatier';
import { MusicFormats } from './Categories';
import PropTypes from 'prop-types';

export default function AddRecord({ recordID, onSave, onClose, showLabels }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_MUSIC });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON });

    //states
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [band, setBand] = useState('');
    const [description, setDescription] = useState('');
    const [publishYear, setPublishYear] = useState(0);
    const [haveAtHome, setHaveAtHome] = useState(false);

    const [format, setFormat] = useState();
    const [formats, setFormats] = useState(MusicFormats);

    //load data
    useEffect(() => {
        if (recordID != null) {
            const getMusic = async () => {
                await fetchMusicFromFirebase(recordID);
            }
            getMusic();
        }
    }, [recordID]);

    useEffect(() => {
        sortFormatsByName();
    }, []);

    const sortFormatsByName = () => {
        const sorted = [...formats].sort((a, b) => {
            const aName = t(`music_format_${a.name}`);
            const bName = t(`music_format_${b.name}`);
            return aName > bName ? 1 : -1;
        });
        setFormats(sorted);
    }

    const fetchMusicFromFirebase = async (recordID) => {
        getFromFirebaseById(Constants.DB_MUSIC_RECORDS, recordID).then((val) => {
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
            setBand(val["band"]);
            setDescription(val["description"]);
            setFormat(val["format"]);
            setHaveAtHome(val["haveAtHome"]);
            setName(val["name"]);
            setPublishYear(val["publishYear"]);
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_name'));
            return;
        }

        onSave(recordID, {
            created, createdBy, band, description, format,
            haveAtHome, name, publishYear
        });

        if (recordID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setDescription('');
        setName('');
        setBand('');
        setPublishYear(0);
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addRecordForm-Band">
                    {showLabels && <Form.Label>{t('band')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('band')}
                        value={band}
                        onChange={(e) => setBand(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addRecordForm-Name">
                    {showLabels && <Form.Label>{t('name')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addRecordForm-PublishYear">
                    {showLabels && <Form.Label>{t('publish_year')}</Form.Label>}
                    <Form.Control type='number' step='any'
                        autoComplete="off"
                        placeholder={t('publish_year')}
                        value={publishYear}
                        onChange={(e) => setPublishYear(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addRecordForm-Category">
                    {showLabels && <Form.Label>{t('format')}</Form.Label>}
                    <Form.Select
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}>
                        {formats.map(({ id, name }) => (
                            <option value={id} key={id}>{t(`music_format_${name}`)}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="addRecordForm-Description">
                    {showLabels && <Form.Label>{t('description')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('description')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addRecordForm-HaveAtHome">
                    <Form.Check
                        type='checkbox'
                        label={t('have')}
                        checked={haveAtHome}
                        value={haveAtHome}
                        onChange={(e) => setHaveAtHome(e.currentTarget.checked)} />
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

AddRecord.defaultProps = {
    showLabels: true
}

AddRecord.propTypes = {
    showLabels: PropTypes.bool
}