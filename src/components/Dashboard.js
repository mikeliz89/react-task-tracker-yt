import { Link } from 'react-router-dom'
import BigButton from '../components/BigButton'
import { useTranslation } from 'react-i18next';

export default function Dashboard() {

    const { t } = useTranslation();

    return (
        <div>
              <Link to={`/managerecipes`}><BigButton textcolor="white" color="#b37401" text={t('dashboard_recipes_button')} /></Link>
              <Link to={`/managetasklists`}><BigButton color="green" text={t('dashboard_tasklists_button')} /></Link>
              <Link to={'/bmicalculator'}><BigButton text={t('dashboard_bmi_calculator_button')} /></Link>
              <Link to={'/manageexercises'}><BigButton color="#ef7c1a" text={t('dashboard_exercises_button')} /></Link>
{/*               <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link>
              <Link to={'/'}><BigButton text="button" /></Link> */}
        </div>
    )
}
