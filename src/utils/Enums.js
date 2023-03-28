/** Reseptityypit */
export const RecipeTypes = {
    /** -Ei mikään- */
    None: 0,
    /** Ruoka */
    Food: 1,
    /** Drinkki */
    Drink: 2
}

/** Listatyypit */
export const ListTypes = {
    /** -Ei mikään- */
    None: 0,
    /** Ruoka */
    Food: 1,
    /** Drinkki */
    Drink: 2,
    /** Koodaus */
    Programming: 3,
    /** Musiikki */
    Music: 4,
    /** Auto */
    Car: 5,
    /** Pelit */
    Games: 6,
    /** Liikunta */
    Exercises: 7,
    /** Retkeily */
    BackPacking: 8,
    /** Kauppalista */
    Shopping: 9,
    /** Leffat */
    Movies: 10,
    /** Muut listat */
    Other: 11
}

/* Listatyypit (kategoriat alasvetovalikossa) */
export const ListTypesArray = [
    {
        //-ei mikään-
        "id": 0,
        "name": "none"
    },
    {
        //Ruoka
        "id": 1,
        "name": "food"
    },
    {
        //Juoma
        "id": 2,
        "name": "drink"
    },
    {
        //koodaus
        "id": 3,
        "name": "programming"
    },
    {
        //musiikki
        "id": 4,
        "name": "music"
    },
    {
        //auto
        "id": 5,
        "name": "car"
    },
    {
        //pelit
        "id": 6,
        "name": "games"
    },
    {
        //retkeily
        "id": 8,
        "name": "backpacking"
    },
    {
        //ostoslistat
        "id": 9,
        "name": "shopping"
    },
    {
        //leffat
        "id": 10,
        "name": "movies"
    },
    {
        //muut listat
        "id": 11,
        "name": "other"
    }
]