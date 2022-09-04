import { useState } from "react";
import CenterWrapper from "./CenterWrapper";

function Counter({ counter, list, originalList }) {

    const getCounterText = () => {
        if (originalList === undefined) {
            return;
        }
        return list.length < originalList.length ? list.length + '/' + counter : counter + '';
    }

    return (
        <CenterWrapper>
            {getCounterText()}
        </CenterWrapper>
    )
}

export default Counter