import { RecipeTypes } from '../../utils/Enums';
import { getRecipeCategoryNameByID, getDrinkCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';

/** Categories */
export const Categories = {
    /** -Ei mikään- */
    None: 0,
    /** Kala */
    Fish: 3,
    /** Pizza */
    Pizza: 11,
    /** hampurilainen */
    Burger: 12
    //todo: koodaa lisää ikoneita eri ruuille
}

// TODO: Tällä hetkellä vain kovakoodatut ruoka-kategoriat
export const RecipeCategories = [
    {
        //-ei mikään-
        "id": 0,
        "name": "none"
    },
    {
        //pasta
        "id": 1,
        "name": "pasta"
    },
    {
        //grilliruoka
        "id": 2,
        "name": "grill"
    },
    {
        //kala
        "id": 3,
        "name": "fish"
    },
    {
        //kana
        "id": 4,
        "name": "chicken"
    },
    {
        //salaatti
        "id": 5,
        "name": "salad"
    },
    {
        //risotto
        "id": 6,
        "name": "risotto"
    },
    {
        //TextMex
        "id": 7,
        "name": "texmex"
    },
    {
        //peruna
        "id": 8,
        "name": "potato"
    },
    {
        //eines
        "id": 9,
        "name": "convenienceFood"
    },
    {
        //leipä
        "id": 10,
        "name": "bread"
    },
    {
        //pizza
        "id": 11,
        "name": "pizza"
    },
    {
        //hampurilainen
        "id": 12,
        "name": "burger"
    },
    {
        //intialainen
        "id": 13,
        "name": "indian"
    },
    {
        //keitto
        "id": 14,
        "name": "soup"
    },
    {
        //muu
        "id": 15,
        "name": "other"
    },
    {
        //thai
        "id": 16,
        "name": "thai"
    },
    {
        //kiinalainen
        "id": 17,
        "name": "chinese"
    },
    {
        //jälkiruoka
        "id": 18,
        "name": "desert"
    },
    {
        //wokki
        "id": 19,
        "name": "wok"
    },
    {
        //lisuke
        "id": 20,
        "name": "sidedish"
    }
]

export const FoodItemCategories = [
    {
        //-ei mikään-
        "id": 0,
        "name": "none"
    },
    {
        //vihannes
        "id": 1,
        "name": "vegetable"
    },
    {
        //maitotuote
        "id": 2,
        "name": "dairyproduct"
    },
    {
        //marja
        "id": 3,
        "name": "berry"
    },
    {
        //hedelmä
        "id": 4,
        "name": "fruit"
    },
    {
        //öljyt ja voit
        "id": 5,
        "name": "oilsandfats"
    },
    {
        //liha
        "id": 6,
        "name": "meat"
    }
]


export function getIconNameByCategory(category) {
    switch (Number(category)) {
        case Categories.Burger:
            return 'hamburger';
        case Categories.Pizza:
            return 'pizza-slice';
        case Categories.Fish:
            return 'fish';
        //todo: koodaa lisää ikoneita eri ruuille
        default:
            return 'utensils';
    }
}

export const getIconName = (recipeType, category) => {
    switch (recipeType) {
        case RecipeTypes.Food:
            return getIconNameByCategory(category);
        case RecipeTypes.Drink:
            return 'glass-martini';
        default: return '';
    }
}

export const getCategoryContent = (recipeType, category) => {
    switch (recipeType) {
        case RecipeTypes.Food:
            return getRecipeCategoryNameByID(category);
        case RecipeTypes.Drink:
            return getDrinkCategoryNameByID(category);
        default: return '';
    }
}

export const getIncredientsUrl = (recipeType) => {
    switch (recipeType) {
        case RecipeTypes.Food:
            return '/recipe-incredients';
        case RecipeTypes.Drink:
            return Constants.DB_DRINK_INCREDIENTS;
        default: return '';
    }
}

export const getViewDetailsUrl = (recipeType) => {
    switch (recipeType) {
        case RecipeTypes.Food:
            return '/recipe';
        case RecipeTypes.Drink:
            return '/drink';
        default: return '';
    }
}