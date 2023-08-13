import GearMaintenanceInstruction from './GearMaintenanceInstruction';

export default function GearMaintenanceInstructions ({ gearMaintenanceInstructions, onDelete }) {

    return (
        <div>
            {gearMaintenanceInstructions.map((instruction) => (
                <GearMaintenanceInstruction key={instruction.id} instruction={instruction} onDelete={onDelete} />
            ))}
        </div>
    )
}