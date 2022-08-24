//react
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../../components/Button';

export default function EditGarnish({ drinkID, garnishID, onEditGarnish, onCloseEditGarnish }) {

    const DB_DRINK_GARNISHES = '/drink-garnishes';

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    //states
    const [name, setName] = useState('');

    useEffect(() => {
        if (drinkID != null) {
            const getGarnish = async () => {
                await fetchGarnishFromFirebase(drinkID)
            }
            getGarnish()
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
        let garnish = { id: garnishID, name };
        onEditGarnish(garnish);
    }

    const close = (e) => {
        onCloseEditGarnish();
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="editGarnishForm-GarnishName">
                <Form.Control type='text'
                    autoComplete="off"
                    placeholder={t('garnish_name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Row>
                <ButtonGroup>
                    <Button type='button' text={t('button_close')} className='btn btn-block' onClick={() => close()} />
                    <Button type='submit' text={t('button_save_garnish')} className='btn btn-block saveBtn' />
                </ButtonGroup>
            </Row>
        </Form>
    )
}
