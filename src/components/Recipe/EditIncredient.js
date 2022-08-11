//react
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../../components/Button';

export default function EditIncredient({ recipeID, incredientID, onEditIncredient, onCloseEditIncredient }) {

    const DB_INCREDIENTS = '/recipe-incredients';

    //translation
    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

    //states
    const [name, setName] = useState('')
    const [amount, setAmount] = useState(0)
    const [unit, setUnit] = useState('')

    useEffect(() => {

        if (recipeID != null) {
            const getIncredient = async () => {
                await fetchIncredientFromFirebase(recipeID)
            }
            getIncredient()
        }
    }, [recipeID]);

    /** Fetch Incredient From Firebase By RecipeID */
    const fetchIncredientFromFirebase = async (recipeID) => {
        const dbref = ref(db, `${DB_INCREDIENTS}/${recipeID}/${incredientID}`);
        get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                setName(val["name"]);
                setUnit(val["unit"]);
                setAmount(val["amount"]);
            }
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        let incredient = { id: incredientID, name, amount, unit };
        onEditIncredient(incredient);
    }

    const close = (e) => {
        onCloseEditIncredient();
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="incredientName">
                <Form.Control type='text'
                    autoComplete="off"
                    placeholder={t('incredient_name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="incredientAmount">
                <Form.Control type='number'
                    autoComplete="off"
                    placeholder={t('incredient_amount')}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="incredientUnit">
                <Form.Control type='text'
                    autoComplete="off"
                    placeholder={t('incredient_unit')}
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)} />
            </Form.Group>
            <Row>
                <ButtonGroup>
                    <Button type='button' text={t('button_close')} className='btn btn-block' onClick={() => close()} />
                    <Button type='submit' text={t('incredient_save_button_text')} className='btn btn-block saveBtn' />
                </ButtonGroup>
            </Row>
        </Form>
    )
}
