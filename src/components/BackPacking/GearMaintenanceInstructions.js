import Counter from '../Site/Counter';

import GearMaintenanceInstruction from './GearMaintenanceInstruction';

export default function GearMaintenanceInstructions ({ gearMaintenanceInstructions, originalList, counter, onDelete }) {

    return (
        <div>
            <Counter list={gearMaintenanceInstructions} originalList={originalList} counter={counter} />
            {gearMaintenanceInstructions.map((instruction) => (
                <GearMaintenanceInstruction key={instruction.id} instruction={instruction} onDelete={onDelete} />
            ))}
        </div>
    )
}

