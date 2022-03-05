import { useState, useEffect } from 'react'
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import Button from '../Button'
import { Dropdown } from 'react-bootstrap';

// TODO: Tällä hetkellä vain kovakoodatut ruoka-kategoriat
const categories =[
    {
       "id":1,
       "name":"Pasta"
    },
    {
       "id":2,
       "name":"Grill"
    },
    {
       "id":3,
       "name":"Fish"
    },
    {
       "id":4,
       "name":"Chicken"
    },
    {
       "id":5,
       "name":"Salad"
    },
    {
       "id":6,
       "name":"Risotto"
    },
    {
       "id":7,
       "name":"Texmex"
    },
    {
       "id":8,
       "name":"Potato"
    },
    {
       "id":9,
       "name":"ConvenienceFood"
    },
    {
       "id":10,
       "name":"Bread"
    },
    {
       "id":11,
       "name":"Pizza"
    },
    {
       "id":12,
       "name":"Burger"
    },
    {
       "id":13,
       "name":"Indian"
    },
    {
       "id":14,
       "name":"Soup"
    },
    {
       "id": 15,
       "name":"Other"
    }
 ]

const AddRecipe = ({recipeID, onAddRecipe}) => {

    const [category, setCategory] = useState("");

    const { t } = useTranslation();

    //states
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [created, setCreated] = useState('')
    const [createdBy, setCreatedBy] = useState('')

    useEffect(() => {
        if(recipeID != null) {            
            const getRecipe = async () => {
                await fetchRecipeFromFirebase(recipeID)
            }
            getRecipe()
            }
      }, []);

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
          }
        });
    }

    const onSubmit = (e) => {
        e.preventDefault()

        //validation
        if(!title) {
            alert(t('please_add_recipe'))
            return
        }
       
        onAddRecipe({ created, createdBy, title, description, category });

        if(recipeID == null) {
            //clear the form
            setTitle('')
            setDescription('')
        }
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addRecipeFormName">
                    <Form.Label>{t('recipe_name')}</Form.Label>
                    <Form.Control type='text'
                        placeholder={ recipeID == null ? t('recipe_name') : t('edit_recipe_name')} 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addRecipeDescription">
                    <Form.Label>{t('description')}</Form.Label>
                    <Form.Control type='text' 
                        placeholder={ recipeID == null ? t('add_description') : t('edit_description') }
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addRecipeCategory">
                    <Form.Label>{t('category')}</Form.Label>
                    <Form.Select onChange={(e) => setCategory(e.target.value) }>
                        {categories.map(({id, name}) => (
                            <option key={id}>{name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Button type='submit' text={t('button_save_recipe')} className='btn btn-primary btn-block' />
            </Form>
            </>
    )
}

export default AddRecipe
