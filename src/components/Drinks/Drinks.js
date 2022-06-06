import Drink from './Drink';

export const Drinks = ({ drinks, onDelete }) => {

    return (
        <div className="page-content">
            {drinks.map((drink) => (
                <Drink key={drink.id} drink={drink} onDelete={onDelete} />
            ))}
        </div>
    )
}

export default Drinks