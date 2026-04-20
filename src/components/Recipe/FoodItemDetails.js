import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { TRANSLATION } from '../../utils/Constants';
import { getFoodItemCategoryNameByID } from '../../utils/ListUtils';

export default function FoodItemDetails({ foodItem }) {
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });

    if (!foodItem) return null;

    return (
        <div>
            <h5>{foodItem.name}</h5>
            <p>{t('fooditem_calories')}: {foodItem.calories}</p>
            <p>{t('fooditem_category')}: {t('fooditem_category_' + getFoodItemCategoryNameByID(foodItem.category))}</p>
            {foodItem.description && <p>{t('description')}: {foodItem.description}</p>}
            {foodItem.haveAtHome !== undefined && (
                <p>
                    {foodItem.haveAtHome
                        ? t('fooditem_have_at_home')
                        : t('fooditem_not_have_at_home')}
                </p>
            )}
        </div>
    );
}

FoodItemDetails.propTypes = {
    foodItem: PropTypes.shape({
        name: PropTypes.string,
        calories: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        category: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        description: PropTypes.string,
        haveAtHome: PropTypes.bool,
    })
};
