//recipe
import FoodItem from './FoodItem';

export default function FoodItems({ foodItems, onDelete, onEdit }) {

    return (
        <>
            {foodItems
                ? foodItems.map((foodItem, index) =>
                    <FoodItem
                        key={foodItem.id}
                        foodItem={foodItem}
                        onDelete={onDelete}
                        onEdit={onEdit} />
                ) : ''
            }
        </>
    )
}