/** Categories */
export const Categories = {
    /** -Ei mikään- */
    None: 0,
    /** Nukkuminen */
    Sleeping: 1,
    /** Elektroniikka */
    Electronics: 2,
    /** Hygienia */
    Hygiene: 3,
    /** työkalu */
    Tool: 4,
    /** vaate */
    Clothing: 5,
    /** Ruuanlaitto */
    Cooking: 6,
    /** Tulenteko */
    FireCreation: 7,
    /** Muu */
    Other: 8
}

// TODO: Tällä hetkellä vain kovakoodatut drinkki-kategoriat
export const GearCategories = [
    {
        //-ei mikään-
        "id": 0,
        "name": "none"
    },
    {
        //nukkuminen
        "id": 1,
        "name": "sleeping"
    },
    {
        //elektroniikka
        "id": 2,
        "name": "electronics"
    },
    {
        //hygienia
        "id": 3,
        "name": "hygiene"
    },
    {
        //työkalu
        "id": 4,
        "name": "tool"
    },
    {
        //vaate
        "id": 5,
        "name": "clothing"
    },
    {
        //ruuanlaitto
        "id": 6,
        "name": "cooking"
    },
    {
        //tulenteko
        "id": 7,
        "name": "firecreation"
    },
    {
        "id": 8,
        "name": "other"
    }
]

export function getIconNameByCategory(category) {
    switch (Number(category)) {
        case Categories.Sleeping:
            return 'campground';
        case Categories.Electronics:
            return 'charging-station';
        case Categories.Tool:
            return 'hammer';
        case Categories.FireCreation:
            return 'burn';
        case Categories.Clothing:
            return 't-shirt';
        case Categories.Cooking:
            return 'utensils';
        case Categories.Hygiene:
            return 'hands-wash';
        default: return '';
    }
}