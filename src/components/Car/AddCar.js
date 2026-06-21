import { useState } from 'react';
import { ButtonGroup, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION } from '../../utils/Constants';
import Button from '../Buttons/Button';
import FormTitle from '../Site/FormTitle';

export default function AddCar({ onSave, onClose, showLabels = true }) {
    
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.CAR });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    const [brand, setBrand] = useState('');
    const [modelName, setModelName] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();

        if (!brand.trim()) {
            alert(t('please_add_brand'));
            return;
        }

        if (!modelName.trim()) {
            alert(t('please_add_model_name'));
            return;
        }

        onSave({
            brand: brand.trim(),
            modelName: modelName.trim()
        });

        setBrand('');
        setModelName('');
    };

    return (
        <div>
            <FormTitle title={t('add_car_title')} />

            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addCarForm-Brand">
                    {showLabels && <Form.Label>{t('brand')}</Form.Label>}
                    <Form.Control
                        autoComplete="off"
                        type='text'
                        placeholder={t('brand')}
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="addCarForm-ModelName">
                    {showLabels && <Form.Label>{t('model_name')}</Form.Label>}
                    <Form.Control
                        autoComplete="off"
                        type='text'
                        placeholder={t('model_name')}
                        value={modelName}
                        onChange={(e) => setModelName(e.target.value)}
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
        </div>
    );
}
