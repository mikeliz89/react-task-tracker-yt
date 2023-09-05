import { ButtonGroup, Row } from "react-bootstrap"
import GoBackButton from "../Buttons/GoBackButton"
import PageContentWrapper from "../Site/PageContentWrapper"
export default function GameDetails() {
    return (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>
            <p>TODO: toteuta tämä sivu</p>
        </PageContentWrapper>
    )
}