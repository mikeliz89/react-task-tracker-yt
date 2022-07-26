//buttons
import BigButton from '../components/BigButton';
//react
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';
//css
import styles from './dashboard.module.css';

export default function Dashboard() {

    //translation
    const { t } = useTranslation('dashboard', { keyPrefix: 'dashboard.buttons' });

    return (
        <>
            {/* Create New Row For Sets of 4 buttons  */}
            <Row>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={`/managerecipes`}><BigButton imageName="recipes.png" textcolor="black" color="#b37401" text={t('recipes')} /></Link>
                </Col>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={`/managetasklists`}><BigButton imageName="tasklists.PNG" textcolor="black" color="#fcba03" text={t('tasklists')} /></Link>
                </Col>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={'/bmicalculator'}><BigButton imageName="calculator.PNG" textcolor="black" text={t('bmi_calculator')} /></Link>
                </Col>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={'/managedrinks'}><BigButton imageName="cocktail.jpg" textcolor="black" color="#f9a9d5" text={t('drinks')} /></Link>
                </Col>
            </Row>
            <Row>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={'/manageexercises'}><BigButton imageName="exercises.PNG" textcolor="black" color="#ef7c1a" text={t('exercises')} /></Link>
                </Col>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={'/linkslist'}><BigButton imageName="links.jpg" textcolor="black" color="white" text={t('links_list')} /></Link>
                </Col>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={'/car'}><BigButton imageName="car.jpg" textcolor="black" color="#0cb058" text={t('car')} /></Link>
                </Col>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={'/managebackpacking'}><BigButton imageName="backpacking.jpg" textcolor="black" color="#0cb058" text={t('backpacking')} comingsoon /></Link>
                </Col>
            </Row>
            <Row>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={'/music'}><BigButton imageName="music.jpg" textcolor="black" color="#0cb058" text={t('music')} comingsoon /></Link>
                </Col>
                <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
                    <Link to={'/games'}><BigButton imageName="games.jpg" textcolor="black" color="#0cb058" text={t('games')} comingsoon /></Link>
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
