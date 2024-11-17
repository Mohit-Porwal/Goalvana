import React, { useState, useEffect } from "react";
import GoalInsights from "../../components/GoalInsights/GoalInsights.jsx";
import NavBar from '../../components/NavBar/NavBar.jsx';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tabs, Tab } from '@mui/material';
import '../../global.css';
import GoalTypes from '../../components/GoalTypes/GoalTypes.jsx';
import fetchAIResponse from '../../api/quotes.js';

export default function HomePage() {
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGoalType, setNewGoalType] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [motivationalQuotes, setMotivationalQuotes] = useState("");
  const prompt = "Generate 20 engaging and energizing motivational quotes to show on home screen of a goal tracking app.";

  // Call fetchData in useEffect to fetch data when the component mounts
  useEffect(() => {
    // Fetch motivational quote only once on component mount
    const fetchQuote = async () => {
      try {
        const aiResponse = await fetchAIResponse(prompt);
        setMotivationalQuotes(aiResponse);
      } catch (error) {
        console.error("Error fetching motivational quote:", error);
      }
    };
    fetchQuote();

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
    <div style={{ position: 'relative' }}>
      <NavBar/>

      {/* Display AI-generated motivational quotes */}
      {motivationalQuotes && (
        //<div style={{ marginTop: '10px', padding: '10px', backgroundColor: 'white' ,borderRadius: '5px', textAlign: 'center' }}>
        <div
        style={{
          position: 'absolute',
          top: '110px', // Adjust the top value to move it up or down independently
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px',
          borderRadius: '5px',
          textAlign: 'center',
          zIndex: 1, // Ensure it appears above other content
          fontWeight: 'bold',
          color: '#3C4142',
          fontSize: 30
        }}
      >  
          <p>{motivationalQuotes}</p>
        </div>
      )}

      {/* Tabs for switching between Goal Stats and Goal Categories */}
      <Tabs sx={{marginTop: '150px', marginLeft: '10%', color: 'black', }} value={selectedTab} onChange={handleTabChange} >
        <Tab label="Goal Insights" sx={{ color: 'black', fontWeight: 'bold', textTransform: 'none', fontSize: 18 }}/>
        <Tab label="Goal Categories" sx={{ color: 'black', fontWeight: 'bold', textTransform: 'none', fontSize: 18 }}/>
      </Tabs>

      {/* Conditional rendering based on selected tab */}
      {selectedTab === 0 ? (
        <div>
          <GoalInsights />
        </div>
      ) : (
        data && (
          <>
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

