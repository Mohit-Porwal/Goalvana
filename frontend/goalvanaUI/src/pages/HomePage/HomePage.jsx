// import React from "react";
// import { useState, useEffect } from "react";
// import GoalTypes from '../../components/GoalTypes/GoalTypes.jsx';

// export default function HomePage() {

//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:5000?user_id=1'); 
//         const result = await response.json();
//         const goalTypesArray = result.goal_types.map(goal => ({
//           goal_type_id: goal.goal_type_id,
//           goalType: goal.goal_type
//         }));
//         setData(goalTypesArray);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   console.log("Data ",data);

//   return (
//     <div>
//       <h1>Your Goals</h1>
//       {data ? ( 
//         <>
//           <GoalTypes goalTypes={data} />
//         </>
//       ): null}
//     </div>
//   )
// }


import React, { useState, useEffect } from "react";
import GoalTypes from '../../components/GoalTypes/GoalTypes.jsx';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function HomePage() {

  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGoalType, setNewGoalType] = useState("");

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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewGoalType("");
  };

  const handleAddGoalType = async () => {
    if (!newGoalType.trim()) {
      alert("Please enter a valid goal type.");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000?user_id=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ goal_type: newGoalType })
      });

      if (response.ok) {
        const result = await response.json();
        setData(prevData => [...prevData, {
          goal_type_id: result.goal_type_id,
          goalType: result.goal_type
        }]);
        handleCloseDialog();
      } else {
        console.error("Failed to add new goal type");
      }
    } catch (error) {
      console.error("Error adding new goal type:", error);
    }
  };

  return (
    <div>
      <h1>Your Goals</h1>
      {/* <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpenDialog}
        sx={{ mb: 2 }}
      >
        Add Goal Type
      </Button> */}

      {/* Dialog for entering new goal type */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Goal Type</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Goal Type Name"
            type="text"
            fullWidth
            value={newGoalType}
            onChange={(e) => setNewGoalType(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddGoalType} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {data ? ( 
        <>
          <GoalTypes goalTypes={data} handleOpenDialog={handleOpenDialog}/>
        </>
      ) : null}
    </div>
  );
}


