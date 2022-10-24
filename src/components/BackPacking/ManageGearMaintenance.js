import { Row, ButtonGroup } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react";
import Button from "../Button";
import GoBackButton from "../GoBackButton";
import PageContentWrapper from "../Site/PageContentWrapper";
import PageTitle from '../Site/PageTitle';
import AddGearMaintenanceInstruction from "./AddGearMaintenanceInstruction";
import * as Constants from "../../utils/Constants";
import { getCurrentDateAsJson } from "../../utils/DateTimeUtils";
import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase } from "../../datatier/datatier";
import { db } from "../../firebase-config";
import { onValue, ref } from "firebase/database";
import GearMaintenanceInstructions from "./GearMaintenanceInstructions";
import { removeFromFirebaseById } from "../../datatier/datatier";
import Counter from "../Site/Counter";
import CenterWrapper from '../Site/CenterWrapper';

function ManageGearMaintenance() {

    //states
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [counter, setCounter] = useState(0);
    const [gearMaintenanceInstructions, setGearMaintenanceInstructions] = useState(null);
    const [originalGearMaintenanceInstructions, setOriginalGearMaintenanceInstructions] = useState(null);

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BACKPACKING, { keyPrefix: Constants.TRANSLATION_BACKPACKING });

    //user
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        let cancel = false;

        const getGearMaintenanceInstructions = async () => {
            if (cancel) {
                return;
            }
            await fetchGearMaintenanceInstructionsFromFirebase();
        }
        getGearMaintenanceInstructions();

        return () => {
            cancel = true;
        }
    }, [])

    const fetchGearMaintenanceInstructionsFromFirebase = async () => {
        const dbref = await ref(db, Constants.DB_BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;
            for (let id in snap) {
                counterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setCounter(counterTemp);
            setLoading(false);
            setGearMaintenanceInstructions(fromDB);
            setOriginalGearMaintenanceInstructions(fromDB);
        })
    }

    const addGearMaintenanceInstruction = (maintenanceInstruction) => {
        try {
            maintenanceInstruction["created"] = getCurrentDateAsJson();
            maintenanceInstruction["createdBy"] = currentUser.email;
            pushToFirebase(Constants.DB_BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS, maintenanceInstruction);
        } catch (ex) {
        }
    }

    const deleteInstruction = (id) => {
        removeFromFirebaseById(Constants.DB_BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS, id);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={Constants.ICON_PLUS}
                        color={showAdd ? 'red' : 'green'}
                        text={t('button_add_maintenance_instructions')} className='btn btn-primary'
                        onClick={() => setShowAdd(!showAdd)} />
                </ButtonGroup>
            </Row>
            <PageTitle title={t('button_manage_gear_maintenance')} />
            {
                showAdd && <AddGearMaintenanceInstruction onSave={addGearMaintenanceInstruction} onClose={() => setShowAdd(false)} />
            }

            {
                gearMaintenanceInstructions != null && gearMaintenanceInstructions.length > 0 ? (
                    <>
                        <Counter list={gearMaintenanceInstructions} originalList={originalGearMaintenanceInstructions} counter={counter} />

                        <GearMaintenanceInstructions gearMaintenanceInstructions={gearMaintenanceInstructions}
                            onDelete={deleteInstruction} />
                    </>
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_gear_maintenance_instructions_to_show')}
                        </CenterWrapper>
                    </>
                )
            }

        </PageContentWrapper>
    )
}

export default ManageGearMaintenance