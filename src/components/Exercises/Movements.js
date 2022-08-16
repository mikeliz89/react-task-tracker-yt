import Movement from './Movement';

const Movements = ({ movements, onDelete }) => {

    return (
        <div>
            {movements.map((movement) => (
                <Movement key={movement.id} movement={movement} onDelete={onDelete} />
            ))}
        </div>
    )
}

export default Movements
