// import React, { useState, useEffect } from "react";
// // import HomePageTabs from '../../components/HomePageTabs/HomePageTabs.jsx';
// import NavBar from '../../components/NavBar/NavBar.jsx';
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
// import '../../global.css';
// import GoalTypes from '../../components/GoalTypes/GoalTypes.jsx';


// export default function HomePage() {

//   const [data, setData] = useState([]);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [newGoalType, setNewGoalType] = useState("");

//   // Call fetchData in useEffect to fetch data when the component mounts
//   useEffect(() => {
//     fetchData(); // This ensures data is fetched when the component mounts
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await fetch('http://127.0.0.1:5000?user_id=1');
//       const result = await response.json();
//       const goalTypesArray = result.goal_types.map(goal => ({
//         goal_type_id: goal.goal_type_id,
//         goalType: goal.goal_type
//       }));
//       setData(goalTypesArray);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   const handleOpenDialog = () => {
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setNewGoalType("");
//   };

//   const handleAddGoalType = async () => {
//     if (!newGoalType.trim()) {
//       alert("Please enter a valid goal type.");
//       return;
//     }

//     try {
//       const response = await fetch('http://127.0.0.1:5000/goalTypes?user_id=1', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ goal_type: newGoalType })
//       });

//       if (response.ok) {
//         const result = await response.json();
//         await fetchData();
//         handleCloseDialog();
//       } else {
//         console.error("Failed to add new goal type");
//       }
//     } catch (error) {
//       console.error("Error adding new goal type:", error);
//     }
//   };

//   return (
//     <div>
//       <NavBar/>

//       {data ? ( 
//         <>
//           {/* <HomePageTabs goalTypes={data} handleOpenDialog={handleOpenDialog}/> */}
//           <GoalTypes goalTypes={data} handleOpenDialog={handleOpenDialog}/>
//         </>
//       ) : null}

//       {/* Dialog for entering new goal type */}
//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>Add New Goal Type</DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Goal Type Name"
//             type="text"
//             fullWidth
//             value={newGoalType}
//             onChange={(e) => setNewGoalType(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="secondary">
//             Cancel
//           </Button>
//           <Button onClick={handleAddGoalType} color="primary">
//             Add
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
// import HomePageTabs from '../../components/HomePageTabs/HomePageTabs.jsx';
import NavBar from '../../components/NavBar/NavBar.jsx';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tabs, Tab } from '@mui/material';
import '../../global.css';
import GoalTypes from '../../components/GoalTypes/GoalTypes.jsx';

export default function HomePage() {
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGoalType, setNewGoalType] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);

  // Call fetchData in useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchData(); // This ensures data is fetched when the component mounts
  }, []);

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
      const response = await fetch('http://127.0.0.1:5000/goalTypes?user_id=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ goal_type: newGoalType })
      });

      if (response.ok) {
        const result = await response.json();
        await fetchData();
        handleCloseDialog();
      } else {
        console.error("Failed to add new goal type");
      }
    } catch (error) {
      console.error("Error adding new goal type:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <NavBar/>

      {/* Tabs for switching between Goal Stats and Goal Categories */}
      <Tabs sx={{marginTop: '100px', marginLeft: '10%'}} value={selectedTab} onChange={handleTabChange} >
        <Tab label="Goal Stats" />
        <Tab label="Goal Categories" />
      </Tabs>

      {/* Conditional rendering based on selected tab */}
      {selectedTab === 0 ? (
        <div>
          <h2>Goal Insights</h2>
        </div>
      ) : (
        data && (
          <>
            {/* <HomePageTabs goalTypes={data} handleOpenDialog={handleOpenDialog}/> */}
            <GoalTypes goalTypes={data} handleOpenDialog={handleOpenDialog}/>
          </>
        )
      )}

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
    </div>
  );
}

