import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import { ref, onValue } from "firebase/database";
import GoBackButton from '../GoBackButton';

export default function RecipeDetails() {

    //states
    const [loading, setLoading] = useState(true)
    const [recipe, setRecipe] = useState({})

    const { t } = useTranslation();
    const params = useParams();
    const navigate = useNavigate();

    //load data
    useEffect(() => {
        const getRecipe = async () => {
            await fetchRecipeFromFirebase();
        }
        getRecipe()
    }, [])

    const fetchRecipeFromFirebase = async () => {
        const dbref = ref(db, '/recipes/' + params.id);
        onValue(dbref, (snapshot) => {
        const data = snapshot.val();
        if(data === null) {
            navigate(-1)
        }
        setRecipe(data)
        setLoading(false);
        })
    }

    return loading ? (
    <h3>{t('loading')}</h3>
    ) : ( 
    <div>
        <GoBackButton />
        <div className="page-content">
            {/* <pre>{JSON.stringify(recipe)}</pre> */}
            <h4>{recipe.title}</h4>
            <p>{recipe.description}</p>
        </div>
    </div>
    )
}
