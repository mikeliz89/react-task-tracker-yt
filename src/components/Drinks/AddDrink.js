import { useState, useEffect } from 'react'
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import Button from '../Button'

// TODO: Tällä hetkellä vain kovakoodatut drinkki-kategoriat
const categories = [
   {
      //rakennettu juoma
      "id": 1,
      "name": "build"
   },
   {
      //sekoitettu juoma
      "id": 2,
      "name": "stir"
   },
   {
      //ravistettava juoma
      "id": 3,
      "name": "shake"
   },
   {
      //mocktail
      "id": 4,
      "name": "mocktail"
   }
]

const AddDrink = ({ drinkID, onAddDrink }) => {

   const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

   //states
   const [category, setCategory] = useState("");
   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')
   const [created, setCreated] = useState('')
   const [createdBy, setCreatedBy] = useState('')

   useEffect(() => {
      if (drinkID != null) {
         const getDrink = async () => {
            await fetchDrinkFromFirebase(drinkID)
         }
         getDrink()
      }
   }, [drinkID]);

   /** get drink from firebase by id (in EDIT drink) */
   const fetchDrinkFromFirebase = async (drinkID) => {

      const dbref = ref(db, '/drinks/' + drinkID);
      get(dbref).then((snapshot) => {
         if (snapshot.exists()) {
            var val = snapshot.val();
            setTitle(val["title"]);
            setDescription(val["description"]);
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
         }
      });
   }

   /** Drink Form Submit */
   const onSubmit = (e) => {
      e.preventDefault()

      //validation
      if (!title) {
         alert(t('please_add_drink'))
         return
      }

      onAddDrink({ created, createdBy, title, description, category });

      if (drinkID == null) {
         //clear the form
         setTitle('')
         setDescription('')
      }
   }

   //todo: Tee checkboxista label clickable
   return (
      <>
         <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addDrinkFormName">
               <Form.Label>{t('name')}</Form.Label>
               <Form.Control type='text'
                  placeholder={drinkID == null ? t('name') : t('name')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkFormDescription">
               <Form.Label>{t('description')}</Form.Label>
               <Form.Control type='text'
                  placeholder={drinkID == null ? t('description') : t('description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkFormCategory">
               <Form.Label>{t('category')}</Form.Label>
               <Form.Select onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(({ id, name }) => (
                     <option key={id}>{t(`category_${name}`)}</option>
                  ))}
               </Form.Select>
            </Form.Group>
            <Button type='submit' text={t('button_save_drink')} className='btn btn-block saveBtn' />
         </Form>
      </>
   )
}

export default AddDrink