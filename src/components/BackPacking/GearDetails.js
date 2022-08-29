//react
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, Table, Row, ButtonGroup, Col } from 'react-bootstrap';
//i18n
import i18n from "i18next";
//firebase
import { db } from '../../firebase-config';
import { ref, onValue } from "firebase/database";
//utils
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getGearCategoryNameByID } from '../../utils/ListUtils';
//buttons
import GoBackButton from '../../components/GoBackButton';
//pagetitle
import PageTitle from '../PageTitle';
//StarRating
import SetStarRating from '../StarRating/SetStarRating';
import StarRating from '../StarRating/StarRating';
//Comment
import AddComment from '../Comments/AddComment';
import Comments from '../Comments/Comments';
//Links
import AddLink from '../Links/AddLink';
import Links from '../Links/Links';

function GearDetails() {

    //constants
    const DB_GEAR = "/backpacking-gear";
    const TRANSLATION = 'backpacking';

    //translation
    const { t } = useTranslation(TRANSLATION, { keyPrefix: TRANSLATION });

    //states
    const [loading, setLoading] = useState(true);
    const [gear, setGear] = useState({});

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //load data
    useEffect(() => {
        const getGear = async () => {
            await fetchGearFromFirebase();
        }
        getGear();
    }, [])

    const fetchGearFromFirebase = async () => {
        const dbref = ref(db, `${DB_GEAR}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1);
            }
            setGear(data);
            setLoading(false);
        })
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>
            <Row>
                <Col>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <PageTitle title={gear.name} iconColor='gray' />
                            </Accordion.Header>
                            <Accordion.Body>
                                <Table striped bordered hover>
                                    <tbody>
                                        <tr>
                                            <td>{t('gear_weight_in_grams')}</td>
                                            <td>{gear.weightInGrams}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('created')}</td>
                                            <td>{getJsonAsDateTimeString(gear.created, i18n.language)}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('created_by')}</td>
                                            <td>{gear.createdBy}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('modified')}</td>
                                            <td>{getJsonAsDateTimeString(gear.modified, i18n.language)}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('category')}</td>
                                            <td>{t('gear_category_' + getGearCategoryNameByID(gear.category))}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
            <Row>
                <Col>
                    <StarRating starCount={gear.stars} />
                </Col>
            </Row>
            <div className="page-content">
                <hr />
                <Comments objID={params.id} url={'drink-comments'} />
                <Links objID={params.id} url={'drink-links'} />
            </div>
        </div>
    )

}

export default GearDetails
