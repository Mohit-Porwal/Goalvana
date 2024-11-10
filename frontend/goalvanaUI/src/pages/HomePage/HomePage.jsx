import React from "react";
import { useState, useEffect } from "react";
import GoalTypes from '../../components/GoalTypes/GoalTypes.jsx';

export default function HomePage() {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000?user_id=1'); 
        const result = await response.json();
        const goalTypesArray = result.goal_types.map(goal => ({
          goal_type_id: goal.goal_type_id,
          goalType: goal.goal_type
        }));
        setData(goalTypesArray);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  console.log("Data ",data);

  return (
    <div>
      <h1>Your Goals</h1>
      {data ? ( 
        <>
          <GoalTypes goalTypes={data} />
        </>
      ): null}
    </div>
  )
}


