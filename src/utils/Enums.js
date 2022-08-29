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
    BackPacking: 8
}

/* Listatyypit (kategoriat alasvetovalikossa) */
export const ListTypesArray = [
    {
        //-ei mikään-
        "id": 0,
        "name": "none"
    },
    {
        //koodaus
        "id": 3,
        "name": "programming"
    },
    {
        //retkeily
        "id": 8,
        "name": "backpacking"
    }
]