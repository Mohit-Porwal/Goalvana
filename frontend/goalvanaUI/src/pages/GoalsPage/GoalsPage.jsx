import React from "react";
import Goals from '../../components/Goals/Goals.jsx';
import { useLocation } from 'react-router-dom';

export default function GoalsPage() {

    const location = useLocation();
    const goalTypeId = location.state?.goalTypeId;

    return (
    <div>
        <h1>Goals</h1>
        {goalTypeId ? (
            <>
                <Goals goalTypeId={goalTypeId}/>
            </>
        ) : null}
    </div>
    )
}
