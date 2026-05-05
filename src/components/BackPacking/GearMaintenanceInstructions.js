import Counter from '../Site/Counter';

import GearMaintenanceInstruction from './GearMaintenanceInstruction';

export default function GearMaintenanceInstructions ({ items, originalList, counter, onDelete }) {

    return (
        <div>
            <Counter list={items} originalList={originalList} counter={counter} />
            {items.map((instruction) => (
                <GearMaintenanceInstruction key={instruction.id} instruction={instruction} onDelete={onDelete} />
            ))}
        </div>
    )
}

