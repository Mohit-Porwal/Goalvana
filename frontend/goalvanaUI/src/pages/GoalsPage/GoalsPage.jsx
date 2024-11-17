import React from "react";
import Goals from '../../components/Goals/Goals.jsx';
import { useLocation } from 'react-router-dom';

export default function GoalsPage() {

    const location = useLocation();
    const goalTypeId = location.state?.goalTypeId;
    const goalType = location.state?.goalType;

    return (
    <div>
        {goalTypeId ? (
            <>
                <Goals goalTypeId={goalTypeId} goalType={goalType}/>
            </>
        ) : null}
    </div>
    )
}
