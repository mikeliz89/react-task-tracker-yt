//react
import { useTranslation } from 'react-i18next';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
//buttons
import Button from '../../components/Button';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";

export default function AddGarnish({ onSave, garnishID, drinkID, onClose }) {

    //constants
    const DB_DRINK_GARNISHES = '/drink-garnishes';

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

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
        const dbref = ref(db, `${DB_DRINK_GARNISHES}/${drinkID}/${garnishID}`);
        get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                setName(val["name"]);
            }
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!name) {
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
