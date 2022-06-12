//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../Button';

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
   },
   {
      //blenderillä sekoitettava
      "id": 5,
      "name": "blender"
   },
   {
      //uutettava
      "id": 6,
      "name": "infusion",
   }
]

const AddDrink = ({ drinkID, onAddDrink }) => {

   const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

   //states
   const [category, setCategory] = useState('');
   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')
   const [glass, setGlass] = useState('')
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
            setGlass(val["glass"]);
            setCreatedBy(val["createdBy"]);
            setCategory(val["category"]);
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

      onAddDrink({ created, createdBy, title, description, category, glass });

      if (drinkID == null) {
         //clear the form
         setTitle('')
         setDescription('')
         setGlass('')
      }
   }

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
            <Form.Group className="mb-3" controlId="addDrinkFormGlass">
               <Form.Label>{t('glass')}</Form.Label>
               <Form.Control type='text'
                  placeholder={drinkID == null ? t('glass') : t('glass')}
                  value={glass}
                  onChange={(e) => setGlass(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkFormCategory">
               <Form.Label>{t('category')}</Form.Label>
               <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}>
                  <option>{t('category_none')}</option>
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
