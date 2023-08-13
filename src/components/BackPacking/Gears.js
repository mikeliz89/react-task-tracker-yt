import Gear from './Gear';

export default function Gears({ gears, onDelete }) {

    return (
        <div>
            {gears.map((gear) => (
                <Gear key={gear.id} gear={gear} onDelete={onDelete} />
            ))}
        </div>
    )
}