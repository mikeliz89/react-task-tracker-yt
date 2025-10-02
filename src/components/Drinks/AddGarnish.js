import { useTranslation } from 'react-i18next';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Button from '../Buttons/Button';
import * as Constants from '../../utils/Constants';
import { getFromFirebaseByIdAndSubId } from '../../datatier/datatier';

export default function AddGarnish({ onSave, garnishID, drinkID, onClose }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_DRINKS });

    //states
    const [name, setName] = useState('');

    useEffect(() => {
        if (drinkID != null) {
            const getGarnish = async () => {
                await fetchGarnishFromFirebase(drinkID);
            }
            getGarnish();
        }
    }, [drinkID]);

    const fetchGarnishFromFirebase = async (drinkID) => {
        getFromFirebaseByIdAndSubId(Constants.DB_DRINK_GARNISHES, drinkID, garnishID).then((val) => {
            setName(val["name"]);
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
            alert(t('please_add_garnish'));
            return;
        }

        onSave(drinkID, { name })

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
