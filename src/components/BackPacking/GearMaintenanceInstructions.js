import GearMaintenanceInstruction from './GearMaintenanceInstruction';

export const GearMaintenanceInstructions = ({ gearMaintenanceInstructions, onDelete }) => {

    return (
        <div>
            {gearMaintenanceInstructions.map((instruction) => (
                <GearMaintenanceInstruction key={instruction.id} instruction={instruction} onDelete={onDelete} />
            ))}
        </div>
    )
}

export default GearMaintenanceInstructions