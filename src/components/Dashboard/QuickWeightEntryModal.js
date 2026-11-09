import PropTypes from 'prop-types';
import { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { useProfileSettings } from '../../contexts/ProfileSettingsContext';
import { pushToFirebaseAndWait } from '../../datatier/datatier';
import { DB, TRANSLATION, VARIANTS } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import Alert from '../Alert';
import Button from '../Buttons/Button';
import { useAlert } from '../Hooks/useAlert';

export default function QuickWeightEntryModal({ show, onHide, onSaved }) {
    const { height: profileHeight } = useProfileSettings() || {};
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BMICALCULATOR });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });
    const [height, setHeight] = useState(profileHeight ?? '');
    const [weight, setWeight] = useState('');
    const [saving, setSaving] = useState(false);
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showFailure,
    } = useAlert();

    async function onSubmit(event) {
        event.preventDefault();
        clearMessages();

        const numericHeight = Number(height);
        const numericWeight = Number(weight);

        if (!Number.isFinite(numericHeight) || numericHeight <= 0) {
            showFailure(t('please_give_height'));
            return;
        }
        if (!Number.isFinite(numericWeight) || numericWeight <= 0) {
            showFailure(t('please_give_weight'));
            return;
        }

        const heightInMeters = numericHeight / 100;
        const bmi = Math.round((numericWeight / (heightInMeters * heightInMeters)) * 10) / 10;
        if (!Number.isFinite(bmi) || bmi === 0) {
            showFailure(t('bmi_is_zero'));
            return;
        }

        setSaving(true);
        try {
            await pushToFirebaseAndWait(DB.WEIGHT_HISTORY, {
                weight,
                currentDateTime: getCurrentDateAsJson(),
                bmi,
            });
        } catch {
            setSaving(false);
            showFailure(tCommon('save_exception'));
            return;
        }

        setSaving(false);
        onSaved(bmi);
        onHide();
    }

    return (
        <Modal show={show} onHide={onHide} centered>
            <Form onSubmit={onSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('calculate_bmi')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert
                        message={message}
                        showMessage={showMessage}
                        error={error}
                        showError={showError}
                        variant={VARIANTS.PRIMARY}
                        onClose={clearMessages}
                    />
                    <Form.Group className="mb-3" controlId="quickWeightEntryHeight">
                        <Form.Label>{t('height')}</Form.Label>
                        <Form.Control
                            autoFocus={!profileHeight}
                            type="number"
                            min="1"
                            step="any"
                            value={height ?? ''}
                            onChange={(event) => setHeight(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="quickWeightEntryWeight">
                        <Form.Label>{t('weight')}</Form.Label>
                        <Form.Control
                            autoFocus={Boolean(profileHeight)}
                            type="number"
                            min="1"
                            step="any"
                            value={weight}
                            onChange={(event) => setWeight(event.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="button"
                        className="btn btn-secondary"
                        text={tCommon('buttons.button_close')}
                        onClick={onHide}
                    />
                    <Button
                        disabled={saving}
                        type="submit"
                        className="btn btn-primary saveBtn"
                        text={tCommon('buttons.button_save')}
                    />
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

QuickWeightEntryModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onSaved: PropTypes.func.isRequired,
};
