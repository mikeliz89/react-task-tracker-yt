//react
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, Table, Row, ButtonGroup, Col } from 'react-bootstrap';
//i18n
import i18n from "i18next";
//firebase
import { db } from '../../firebase-config';
import { ref, onValue, child, push, update } from "firebase/database";
//utils
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getGearCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';
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
//auth
import { useAuth } from '../../contexts/AuthContext';
//page
import PageContentWrapper from '../PageContentWrapper';

function GearDetails() {

    //constants
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

    //auth
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        const getGear = async () => {
            await fetchGearFromFirebase();
        }
        getGear();
    }, [])

    const fetchGearFromFirebase = async () => {
        const dbref = ref(db, `${Constants.DB_GEAR}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1);
            }
            setGear(data);
            setLoading(false);
        })
    }

    const saveStars = async (stars) => {
        const id = params.id;
        const updates = {};
        gear["modified"] = getCurrentDateAsJson()
        gear["stars"] = Number(stars);
        updates[`${Constants.DB_GEAR}/${id}`] = gear;
        update(ref(db), updates);
    }

    const addCommentToGear = (comment) => {
        const id = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        const dbref = child(ref(db, Constants.DB_GEAR_COMMENTS), id);
        push(dbref, comment);
    }

    const addLinkToGear = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        const dbref = child(ref(db, Constants.DB_GEAR_LINKS), id);
        push(dbref, link);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
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
            <Row>
                <Col>
                    <SetStarRating starCount={gear.stars} onSaveStars={saveStars} />
                    <AddComment onSave={addCommentToGear} />
                    <AddLink onSaveLink={addLinkToGear} />
                </Col>
            </Row>
            <hr />
            <Comments objID={params.id} url={'backpacking-gear-comments'} />
            <Links objID={params.id} url={'backpacking-gear-links'} />
        </PageContentWrapper>
    )
}

export default GearDetails
