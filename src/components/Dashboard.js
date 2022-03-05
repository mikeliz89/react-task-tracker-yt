import { Link } from 'react-router-dom'
import BigButton from '../components/BigButton'
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';

export default function Dashboard() {

    const { t } = useTranslation();

    return (
        <>
        {/* Create New Row For Sets of 4 buttons  */}
        <Row>
            <Col md={3} sm={6} xs={6}>
                <Link to={`/managerecipes`}><BigButton imageName="recipes.png" textcolor="black" color="#b37401" text={t('dashboard_recipes_button')} /></Link>
            </Col>
            <Col md={3} sm={6} xs={6}>
                <Link to={`/managetasklists`}><BigButton imageName="tasklists.PNG" textcolor="black" color="green" text={t('dashboard_tasklists_button')} /></Link>
            </Col>
            <Col md={3} sm={6} xs={6}>
                <Link to={'/bmicalculator'}><BigButton imageName="calculator.PNG" textcolor="black" text={t('dashboard_bmi_calculator_button')} /></Link>
            </Col>
            <Col md={3} sm={6} xs={6}>
                <Link to={'/manageexercises'}><BigButton imageName="exercises.PNG" textcolor="black" color="#ef7c1a" text={t('dashboard_exercises_button')} /></Link>
            </Col>
        </Row>

                {/* <Link to={'/'}><BigButton text="button" /></Link>
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
        </>
    )
}
