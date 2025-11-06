import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../Buttons/Button';
import { TRANSLATION, DB } from "../../utils/Constants";
import useFetchById from '../Hooks/useFetchById';
import PropTypes from 'prop-types';

export default function AddKaraokeSong({ songID, onSave, onClose, showLabels }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //states
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    //load data
    const songData = useFetchById(DB.MUSIC_KARAOKE_SONGS, songID);

    useEffect(() => {
        if (songData) {
            setCreated(songData.created || '');
            setCreatedBy(songData.createdBy || '');
            setDescription(songData.description || '');
            setName(songData.name || '');
        }
    }, [songData]);

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_name'));
            return;
        }

        onSave(songID, {
            created, createdBy, description, name
        });

        if (songID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setDescription('');
        setName('');
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                {/* Tapahtuman nimi */}
                <Form.Group className="mb-3" controlId="addEventForm-Name">
                    {showLabels && <Form.Label>{t('karaoke_song_name')}</Form.Label>}
                    <Form.Control type='text'
                        autoComplete="off"
                        placeholder={t('karaoke_song_name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
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
                        <Button type='button' text={tCommon('buttons.button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button type='submit' text={tCommon('buttons.button_save')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
        </>
    )
}

AddKaraokeSong.defaultProps = {
    showLabels: true
}

AddKaraokeSong.propTypes = {
    showLabels: PropTypes.bool
}