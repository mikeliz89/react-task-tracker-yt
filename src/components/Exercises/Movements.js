import Movement from './Movement';

export default function Movements({ movements, onDelete }) {

    return (
        <div>
            {movements.map((movement) => (
                <Movement key={movement.id} movement={movement} onDelete={onDelete} />
            ))}
        </div>
    )
}