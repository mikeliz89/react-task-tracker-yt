//react
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../Button'

// TODO: Tällä hetkellä vain kovakoodatut ruoka-kategoriat
const categoriesTemp = [
   {
      "id": 1,
      "name": "pasta"
   },
   {
      "id": 2,
      "name": "grill"
   },
   {
      "id": 3,
      "name": "fish"
   },
   {
      "id": 4,
      "name": "chicken"
   },
   {
      "id": 5,
      "name": "salad"
   },
   {
      "id": 6,
      "name": "risotto"
   },
   {
      "id": 7,
      "name": "texmex"
   },
   {
      "id": 8,
      "name": "potato"
   },
   {
      "id": 9,
      "name": "convenienceFood"
   },
   {
      "id": 10,
      "name": "bread"
   },
   {
      "id": 11,
      "name": "pizza"
   },
   {
      "id": 12,
      "name": "burger"
   },
   {
      "id": 13,
      "name": "indian"
   },
   {
      "id": 14,
      "name": "soup"
   },
   {
      "id": 15,
      "name": "other"
   },
   {
      "id": 16,
      "name": "thai"
   }
]

const AddRecipe = ({ recipeID, onAddRecipe }) => {

   const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

   //states
   const [category, setCategory] = useState("");
   const [categories, setCategories] = useState(categoriesTemp);
   const [title, setTitle] = useState('')
   const [description, setDescription] = useState('')
   const [created, setCreated] = useState('')
   const [createdBy, setCreatedBy] = useState('')
   const [isCore, setIsCore] = useState(false)

   useEffect(() => {
      if (recipeID != null) {
         const getRecipe = async () => {
            await fetchRecipeFromFirebase(recipeID)
         }
         getRecipe()
      }
   }, [recipeID]);

   useEffect(() => {
      handleSort();
    }, categories);

   /** get recipe from firebase by recipeID (in EDIT recipe) */
   const fetchRecipeFromFirebase = async (recipeID) => {

      const dbref = ref(db, '/recipes/' + recipeID);
      get(dbref).then((snapshot) => {
         if (snapshot.exists()) {
            var val = snapshot.val();
            setTitle(val["title"]);
            setDescription(val["description"]);
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
            setIsCore(val["isCore"])
         }
      });
   }
   
   const handleSort = () => {
      const sortedCategories = [...categories].sort((a,b) => {
            return a.name > b.name ? 1 : -1;
      });
      setCategories(sortedCategories);
   }

   /** Recipe Form Submit */
   const onSubmit = (e) => {
      e.preventDefault()

      //validation
      if (!title) {
         alert(t('please_add_recipe'))
         return
      }

      onAddRecipe({ created, createdBy, title, description, category, isCore });

      if (recipeID == null) {
         //clear the form
         setTitle('')
         setDescription('')
         setIsCore(false)
      }
   }
   
   return (
      <>
         <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addRecipeFormName">
               <Form.Label>{t('recipe_name')}</Form.Label>
               <Form.Control type='text'
                  placeholder={recipeID == null ? t('recipe_name') : t('edit_recipe_name')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addRecipeFormDescription">
               <Form.Label>{t('description')}</Form.Label>
               <Form.Control type='text'
                  placeholder={recipeID == null ? t('add_description') : t('edit_description')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addRecipeFormCategory">
               <Form.Label>{t('category')}</Form.Label>
               <Form.Select onChange={(e) => setCategory(e.target.value)}>
                  <option>{t('category_none')}</option>
                  {categories.map(({ id, name }) => (
                     <option key={id}>{t(`category_${name}`)}</option>
                  ))}
               </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="AddRecipeFormIsCore">
               <Form.Check
                  type='checkbox'
                  label={t('set_isCore')}
                  checked={isCore}
                  value={isCore}
                  onChange={(e) => setIsCore(e.currentTarget.checked)} />
            </Form.Group>
            <Button type='submit' text={t('button_save_recipe')} className='btn btn-block saveBtn' />
         </Form>
      </>
   )
}

export default AddRecipe
