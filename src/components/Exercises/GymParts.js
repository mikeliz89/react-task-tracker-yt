//react
import { useTranslation } from 'react-i18next';

function GymParts({ parts }) {

    //translation
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

    return (
        <>
            <h5>{t('gym_parts')}</h5>
            <div>
                {parts.map((part) => (
                    <p key={part.id}>{part.name}: {part.series} x {part.weight > 0 ? part.weight + ' (kg) x' : ''}   {part.repeat}</p>
                ))}
            </div>
        </>
    )
}

export default GymParts

