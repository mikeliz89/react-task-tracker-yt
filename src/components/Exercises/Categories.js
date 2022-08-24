/** Categories */
export const Categories = {
    /** -Ei mikään- */
    None: 0,
    /** Juoksu */
    Running: 1,
    /** Kävely */
    Walking: 2,
    /** Kuntosali/painoharjoittelu */
    Gym: 3,
    /** Kajakointi/melonta */
    Kayaking: 4,
    /** Jumppa */
    Aerobics: 5,
    /** Pyöräily */
    Biking: 6,
    /** Kuntopyöräily */
    BikingInside: 7
}

export const ExerciseCategories = [
    {
        //Ei mikään
        "id": 0,
        "name": "none"
    },
    {
        //Juoksu
        "id": 1,
        "name": "running"
    },
    {
        //Kävely
        "id": 2,
        "name": "walking"
    },
    {
        //Kuntosali/painoharjoittelu
        "id": 3,
        "name": "gym"
    },
    {
        //Kajakointi/melonta
        "id": 4,
        "name": "kayaking"
    },
    {
        //Jumppa
        "id": 5,
        "name": "aerobics"
    },
    {
        //Pyöräily
        "id": 6,
        "name": "biking"
    },
    {
        //Kuntopyöräily
        "id": 7,
        "name": "biking_inside"
    }
]

export const MovementCategories = [
    {
        //Ei mikään
        "id": 0,
        "name": "none"
    },
    {
        //Takareidet
        "id": 1,
        "name": "hamstring"
    },
    {
        //Etureidet
        "id": 2,
        "name": "quads"
    },
    {
        //Hauikset
        "id": 3,
        "name": "biceps"
    },
    {
        //Rinta
        "id": 4,
        "name": "chest"
    },
    {
        //Selkä
        "id": 5,
        "name": "back"
    },
    {
        //Vatsalihakset
        "id": 6,
        "name": "abs"
    },
    {
        //Muut
        "id": 7,
        "name": "other"
    },
]

export function getTitleByCategory(category) {
    switch (Number(category)) {
        case Categories.Aerobics:
            return 'title_aerobics';
        case Categories.Biking:
            return 'title_biking';
        case Categories.BikingInside:
            return 'title_biking_inside';
        case Categories.Gym:
            return 'title_gym';
        case Categories.Kayaking:
            return 'title_kayaking';
        case Categories.Running:
            return 'title_running';
        case Categories.Walking:
            return 'title_walking';
        default: return '';
    }
}

export function getIconNameByCategory(category) {
    switch (Number(category)) {
        case Categories.Aerobics:
            return 'child';
        case Categories.Biking:
            return 'biking';
        case Categories.BikingInside:
            return 'biking';
        case Categories.Gym:
            return 'dumbbell';
        case Categories.Kayaking:
            return 'ship';
        case Categories.Running:
            return 'running';
        case Categories.Walking:
            return 'walking';
        default: return '';
    }
}