import { Link } from "react-router-dom";
import { Col } from "react-bootstrap";
import styles from './dashboard.module.css';

function DashboardItem(props) {

    const { link, children } = props;

    return (
        <Col className={styles.BigBtnCol} md={3} sm={6} xs={6}>
            <Link to={link}>
                {children}
            </Link>
        </Col>
    )
}

export default DashboardItem