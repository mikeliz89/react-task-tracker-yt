//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../Button';

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
   },
   {
      //konjakki
      "id": 10,
      "name": "cognac"
   },
   {
      //brandy
      "id": 11,
      "name": "brandy"
   },
   {
      //rommi
      "id": 12,
      "name": "rum"
   },
   {
      //katkero
      "id": 13,
      "name": "bitters"
   },
   {
      //gin
      "id": 14,
      "name": "gin"
   }
]

const AddDrinkingProduct = ({ drinkingProductID, onAddDrinkingProduct }) => {

   const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

   //states
   const [category, setCategory] = useState('');
   const [name, setName] = useState('');
   const [manufacturer, setManufacturer] = useState('');
   const [description, setDescription] = useState('');
   const [created, setCreated] = useState('');
   const [createdBy, setCreatedBy] = useState('');

   useEffect(() => {
      if (drinkingProductID != null) {
         const getDrinkingProduct = async () => {
            await fetchDrinkingProductFromFirebase(drinkingProductID)
         }
         getDrinkingProduct()
      }
   }, [drinkingProductID]);

   /** get drink incredient from firebase by id (in EDIT drink incredient) */
   const fetchDrinkingProductFromFirebase = async (id) => {
      const dbref = ref(db, '/drinkingproducts/' + id);
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

      onAddDrinkingProduct({ created, createdBy, name, description, category, manufacturer });

      if (drinkingProductID == null) {
         //clear the form
         setName('')
         setManufacturer('')
         setDescription('')
         setCategory('')
      }
   }

   return (
      <>
         <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addDrinkingProductForm-Name">
               <Form.Label>{t('drinkingproduct_name')}</Form.Label>
               <Form.Control type='text'
                  placeholder={t('drinkingproduct_name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkingProductForm-Description">
               <Form.Label>{t('drinkingproduct_description')}</Form.Label>
               <Form.Control type='text'
                  placeholder={t('drinkingproduct_description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkingProductForm-Manufacturer">
               <Form.Label>{t('drinkingproduct_manufacturer')}</Form.Label>
               <Form.Control type='text'
                  placeholder={t('drinkingproduct_manufacturer')}
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addDrinkingProductForm-Category">
               <Form.Label>{t('drinkingproduct_category')}</Form.Label>
               <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}>
                  <option>{t('category_none')}</option>
                  {categories.map(({ id, name }) => (
                     <option key={id}>{t(`drinkingproduct_category_${name}`)}</option>
                  ))}
               </Form.Select>
            </Form.Group>
            <Button type='submit' text={t('button_save_drink')} className='btn btn-block saveBtn' />
         </Form>
      </>
   )
}

export default AddDrinkingProduct
