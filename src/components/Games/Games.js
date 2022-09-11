import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import GoBackButton from '../GoBackButton';
import Icon from '../Icon';
import PageContentWrapper from '../PageContentWrapper';
import PageTitle from '../PageTitle';
import * as Constants from '../../utils/Constants';

export default function Games() {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_GAMES, { keyPrefix: Constants.TRANSLATION_GAMES });

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('games_title')} />
            <div>
                <Link to={Constants.NAVIGATION_MANAGE_GAMELISTS} className='btn btn-primary'>
                    <Icon name='list-alt' color='white' />
                    {t('button_game_lists')}
                </Link>
            </div>
        </PageContentWrapper>
    )
}
