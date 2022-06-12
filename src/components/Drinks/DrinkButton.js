//react
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
//button
import Button from '../Button';

export default function DrinkButton({ onShowAddDrink, showAdd }) {

    const location = useLocation();
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    return (
        <>
            {location.pathname === '/managedrinks' && (
                <Button
                    color={showAdd ? 'red' : 'green'}
                    text={showAdd ? t('button_close') : t('button_add_drinks')}
                    onClick={onShowAddDrink} />
            )
            }
        </>
    )
}
