//react
import { useTranslation } from 'react-i18next';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import { useState } from 'react';
//buttons
import Button from '../../components/Button';

export default function AddGarnish({ onAddGarnish, garnishID, drinkID, onClose }) {

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    //states
    const [name, setName] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            return;
        }

        onAddGarnish(drinkID, { name })

        if (garnishID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setName('');
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addGarnishForm-Name">
                <Form.Label>{t('garnish_name')}</Form.Label>
                <Form.Control
                    autoComplete="off"
                    type='text'
                    placeholder={t('garnish_name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Row>
                <ButtonGroup>
                    <Button type='button' text={t('button_close')} className='btn btn-block'
                        onClick={() => onClose()} />
                    <Button type='submit' text={t('button_save_garnish')} className='btn btn-block saveBtn' />
                </ButtonGroup>
            </Row>
        </Form>
    )
}
