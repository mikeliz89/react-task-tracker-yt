import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ButtonGroup, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION, DB } from '../../utils/Constants';
import Button from '../Buttons/Button';
import useFetchByIdAndSubId from '../Hooks/useFetchByIdAndSubId';

function parseTimestampToSeconds(value) {
    if (!value || typeof value !== 'string') {
        return null;
    }

    const parts = value
        .trim()
        .split(':')
        .map((part) => Number(part));

    if (parts.some((part) => Number.isNaN(part))) {
        return null;
    }

    if (parts.length === 2) {
        const [minutes, seconds] = parts;
        if (minutes < 0 || seconds < 0 || seconds > 59) {
            return null;
        }

        return (minutes * 60) + seconds;
    }

    if (parts.length === 3) {
        const [hours, minutes, seconds] = parts;
        if (hours < 0 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
            return null;
        }

        return (hours * 3600) + (minutes * 60) + seconds;
    }

    return null;
}

function formatTimestampFromSeconds(totalSeconds) {
    const safeSeconds = Math.max(0, Number(totalSeconds) || 0);

    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function AddKaraokeLyricRow({ lyricRowID, songID, onSave, onClose, showLabels }) {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MUSIC });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    const [timestamp, setTimestamp] = useState('0:00');
    const [lyric, setLyric] = useState('');

    const lyricRowData = useFetchByIdAndSubId(DB.MUSIC_KARAOKE_SONG_LYRICS, songID, lyricRowID);

    useEffect(() => {
        if (lyricRowData) {
            setTimestamp(lyricRowData.timestamp || '0:00');
            setLyric(lyricRowData.lyric || '');
        }
    }, [lyricRowData]);

    const clearForm = () => {
        setTimestamp('0:00');
        setLyric('');
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!lyric || lyric.trim().length === 0) {
            alert(t('karaoke_lyric_required'));
            return;
        }

        const parsedSeconds = parseTimestampToSeconds(timestamp);
        if (parsedSeconds == null) {
            alert(t('karaoke_timestamp_invalid'));
            return;
        }

        const normalizedTimestamp = formatTimestampFromSeconds(parsedSeconds);

        onSave(songID, {
            timestamp: normalizedTimestamp,
            lyric: lyric.trim(),
            sortIndex: parsedSeconds
        });

        if (lyricRowID == null) {
            clearForm();
        }
    };

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className='mb-3' controlId='addKaraokeLyricRowFormTimestamp'>
                {showLabels && <Form.Label>{t('karaoke_lyric_timestamp')}</Form.Label>}
                <Form.Control
                    autoComplete='off'
                    type='text'
                    placeholder={t('karaoke_timestamp_placeholder')}
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                />
            </Form.Group>

            <Form.Group className='mb-3' controlId='addKaraokeLyricRowFormLyric'>
                {showLabels && <Form.Label>{t('karaoke_lyric_text')}</Form.Label>}
                <Form.Control
                    autoComplete='off'
                    type='text'
                    placeholder={t('karaoke_lyric_text')}
                    value={lyric}
                    onChange={(e) => setLyric(e.target.value)}
                />
            </Form.Group>

            <Row>
                <ButtonGroup>
                    <Button
                        type='button'
                        text={tCommon('buttons.button_close')}
                        className='btn btn-block'
                        onClick={() => onClose()}
                    />
                    <Button
                        type='submit'
                        text={tCommon('buttons.button_save')}
                        className='btn btn-block saveBtn'
                    />
                </ButtonGroup>
            </Row>
        </Form>
    );
}

AddKaraokeLyricRow.defaultProps = {
    showLabels: true,
};

AddKaraokeLyricRow.propTypes = {
    showLabels: PropTypes.bool,
    lyricRowID: PropTypes.string,
    songID: PropTypes.string,
    onSave: PropTypes.func,
    onClose: PropTypes.func,
};
