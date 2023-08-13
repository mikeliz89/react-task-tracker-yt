import { Row, ButtonGroup } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import PageContentWrapper from "../Site/PageContentWrapper";
import PageTitle from '../Site/PageTitle';
import AddGearMaintenanceInstruction from "./AddGearMaintenanceInstruction";
import * as Constants from "../../utils/Constants";
import { getCurrentDateAsJson } from "../../utils/DateTimeUtils";
import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase } from "../../datatier/datatier";
import GearMaintenanceInstructions from "./GearMaintenanceInstructions";
import { removeFromFirebaseById } from "../../datatier/datatier";
import Counter from "../Site/Counter";
import CenterWrapper from '../Site/CenterWrapper';
import { useToggle } from "../UseToggle";
import useFetch from "../useFetch";

export default function ManageGearMaintenance() {

    //fetch data
    const { data: gearMaintenanceInstructions,
        originalData: originalGearMaintenanceInstructions,
        counter, loading } = useFetch(Constants.DB_BACKPACKING_GEAR_MAINTENANCE_INSTRUCTIONS);

    //toggle
    const { status: showAddGearMaintenance, toggleStatus: toggleAddGearMaintenance } = useToggle();

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_BACKPACKING, { keyPrefix: Constants.TRANSLATION_BACKPACKING });

    //user
    const { currentUser } = useAuth();

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

            <PageTitle title={t('button_manage_gear_maintenance')} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={Constants.ICON_PLUS}
                        color={showAddGearMaintenance ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                        text={t('button_add_maintenance_instructions')} className='btn btn-primary'
                        onClick={toggleAddGearMaintenance} />
                </ButtonGroup>
            </Row>

            {
                showAddGearMaintenance &&
                <AddGearMaintenanceInstruction
                    onSave={addGearMaintenanceInstruction}
                    onClose={toggleAddGearMaintenance}
                />
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