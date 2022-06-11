import { useState, useEffect } from 'react'
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import Button from '../Button'

// TODO: Tällä hetkellä vain kovakoodatut tuote-kategoriat
const categories = [
   {
      //vahva viina
      "id": 1,
      "name": "spirit"
   },
   {
      //likööri
      "id": 2,
      "name": "licour"
   },
   {
      //viski
      "id": 3,
      "name": "whiskey"
   },
   {
      //viini
      "id": 4,
      "name": "wine"
   }, 
   {
      //vodka
      "id": 5,
      "name": "vodka"
   }, 
   {
      //vermutti
      "id": 6,
      "name": "vermut"
   },
   {
      //triple sec
      "id": 7, 
      "name": "triplesec"
   }, 
   {
      //tequila
      "id": 8,
      "name": "tequila"
   },
   {
      //limsa
      "id": 9,
      "name": "lemonade"
   }
]

const AddDrinkIncredient = ({ drinkIncredientID, onAddDrinkIncredient }) => {

   const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

   //states
   const [category, setCategory] = useState("");
   const [name, setName] = useState('')
   const [manufacturer, setManufacturer] = useState('')
   const [description, setDescription] = useState('')
   const [created, setCreated] = useState('')
   const [createdBy, setCreatedBy] = useState('')

   useEffect(() => {
      if (drinkIncredientID != null) {
         const getDrinkIncredient = async () => {
            await fetchDrinkIncredientFromFirebase(drinkIncredientID)
         }
         getDrinkIncredient()
      }
   }, [drinkIncredientID]);

   /** get drink incredient from firebase by id (in EDIT drink incredient) */
   const fetchDrinkIncredientFromFirebase = async (drinkIncredientID) => {

      const dbref = ref(db, '/drinkincredients/' + drinkIncredientID);
      get(dbref).then((snapshot) => {
         if (snapshot.exists()) {
            var val = snapshot.val();
            setName(val["name"]);
            setDescription(val["description"]);
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
            setCategory(val["category"]);
            setManufacturer(val["manufacturer"]);
         }
      });
   }

   /** Drink Form Submit */
   const onSubmit = (e) => {
      e.preventDefault()

      //validation
      if (!name) {
         alert(t('please_add_drink_incredient'))
         return
      }

      onAddDrinkIncredient({ created, createdBy, name, description, category, manufacturer });

      if (drinkIncredientID == null) {
         //clear the form
         setName('')
         setManufacturer('')
         setDescription('')
      }
   }

   return (
      <>
         <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addDrinkIncredientFormName">
               <Form.Label>{t('incredient_name')}</Form.Label>
               <Form.Control type='text'
                  placeholder={drinkIncredientID == null ? t('incredient_name') : t('incredient_name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkFormIncredientDescription">
               <Form.Label>{t('description')}</Form.Label>
               <Form.Control type='text'
                  placeholder={drinkIncredientID == null ? t('description') : t('description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkFormIncredientManufacturer">
               <Form.Label>{t('incredient_manufacturer')}</Form.Label>
               <Form.Control type='text'
                  placeholder={drinkIncredientID == null ? t('incredient_manufacturer') : t('incredient_manufacturer')}
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkIncredientFormCategory">
               <Form.Label>{t('category')}</Form.Label>
               <Form.Select onChange={(e) => setCategory(e.target.value)}>
                  {categories.map(({ id, name }) => (
                     <option key={id}>{t(`incredient_category_${name}`)}</option>
                  ))}
               </Form.Select>
            </Form.Group>
            <Button type='submit' text={t('button_save_drink')} className='btn btn-block saveBtn' />
         </Form>
      </>
   )
}

export default AddDrinkIncredient
