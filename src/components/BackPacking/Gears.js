import Gear from './Gear';

export const Gears = ({ gears, onDelete }) => {

    return (
        <div>
            {gears.map((gear) => (
                <Gear key={gear.id} gear={gear} onDelete={onDelete} />
            ))}
        </div>
    )
}

export default Gears