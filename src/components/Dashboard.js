import { Link } from 'react-router-dom'
import BigButton from '../components/BigButton'
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';
import styles from './dashboard.module.css';

export default function Dashboard() {

    const { t } = useTranslation();

    return (
        <>
            {/* Create New Row For Sets of 4 buttons  */}
            <Row>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={`/managerecipes`}><BigButton imageName="recipes.png" textcolor="black" color="#b37401" text={t('dashboard_recipes_button')} /></Link>
                </Col>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={`/managetasklists`}><BigButton imageName="tasklists.PNG" textcolor="black" color="#fcba03" text={t('dashboard_tasklists_button')} /></Link>
                </Col>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={'/bmicalculator'}><BigButton imageName="calculator.PNG" textcolor="black" text={t('dashboard_bmi_calculator_button')} /></Link>
                </Col>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={'/manageexercises'}><BigButton imageName="exercises.PNG" textcolor="black" color="#ef7c1a" text={t('dashboard_exercises_button')} comingsoon /></Link>
                </Col>
            </Row>
            <Row>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={'/managedrinks'}><BigButton imageName="cocktail.jpg" textcolor="black" color="#f9a9d5" text={t('dashboard_drinks_button')} comingsoon /></Link>
                </Col>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={'/managebackpacking'}><BigButton imageName="backpacking.jpg" textcolor="black" color="#0cb058" text={t('dashboard_backpacking_button')} comingsoon /></Link>
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
