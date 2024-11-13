import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Card, CardContent, CardActions, Button, Box } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import { FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const CircleIconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  fontSize: 16,
  marginRight: theme.spacing(0), // Adds spacing between the circle and text
}));

export default function Goals({ goalTypeId, goalType }) {
  const [open, setOpen] = useState(false);
  const [goalStatus, setGoalStatus] = useState('');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalsByStatus, setGoalsByStatus] = useState([]);
  const [editingGoal, setEditingGoal] = useState({});

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/${goalType}/goals?user_id=1&goal_type_id=${goalTypeId}`);
        const data = await response.json();
        setGoalsByStatus(data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };
    fetchGoals();
  }, [goalType]); // Optionally add `goalType` as a dependency if it can change
  
  const handleClickOpen = () => {
    setGoalTitle('');
    setGoalDescription('');
    setGoalStatus('');
    setEditingGoal(null); // Ensure no goal is being edited
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateGoal = () => {
    const newGoal = {
      user_id: 1,
      goal_title: goalTitle,
      goal_description: goalDescription,
      goal_status: goalStatus,
      goal_type_id: goalTypeId,
    };

    fetch(`http://127.0.0.1:5000/${goalType}/goals?user_id=1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newGoal),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Goal created:', data);
        // Update the state with the newly created goal
        setGoalsByStatus((prevGoals) => ({
          ...prevGoals,
          [goalStatus]: [...(prevGoals[goalStatus] || []), data],
        }));
        setOpen(false); // Close the dialog on successful submission
        // Optionally reset input fields
        setGoalTitle('');
        setGoalDescription('');
        setGoalStatus('');
      })
      .catch((error) => {
        console.error('Error creating goal:', error);
      });
  };

  const handleEditGoal = (goal) => {
    // Prefill the fields for editing
    setGoalTitle(goal.goal_title);
    setGoalDescription(goal.goal_description);
    setGoalStatus(goal.goal_status);
    setEditingGoal(goal); // New state to track the goal being edited
    setOpen(true); // Open the dialog for editing
  };

  const handleSaveEdit = () => {
    console.log("Inside "+JSON.stringify(editingGoal));
    const updatedGoal = {
      goal_id: editingGoal.goal_id,
      user_id: 1, // Assuming a hardcoded user_id as mentioned earlier
      goal_title: goalTitle,
      goal_description: goalDescription,
      goal_status: goalStatus,
      goal_type_id: goalTypeId,
    };
    
    console.log("Goal id "+ updatedGoal.goal_id);
    
    fetch(`http://127.0.0.1:5000/${goalType}/goals?user_id=1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedGoal),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Goal updated:', data);
  
        // Update the state with the edited goal
        setGoalsByStatus((prevGoals) => {
          const newGoals = { ...prevGoals };
          
          console.log("New Goals "+ JSON.stringify(newGoals));

          // 1. Remove the goal from the old status
          const oldStatusGoals = newGoals[editingGoal.goal_status] || [];
          newGoals[editingGoal.goal_status] = oldStatusGoals.filter(g => g.goal_id !== editingGoal.goal_id);
  
          // 2. Add the updated goal into the new status
          if (!newGoals[goalStatus]) {
            newGoals[goalStatus] = [];
          }
          console.log("Data  "+ JSON.stringify(data));

          // Add updated goal data into the correct status
          newGoals[goalStatus].push({
            ...updatedGoal,
            goal_title: goalTitle,   // Ensure the title is updated
            goal_description: goalDescription,  // Ensure the description is updated
          });
  
          return newGoals;
        });
  
        handleClose(); // Close dialog on successful save
        setEditingGoal(null); // Reset editing state
        console.log("Editing "+ JSON.stringify(editingGoal));
      })
      .catch((error) => {
        console.error('Error updating goal:', error);
      });
  };
  
  const handleDeleteGoal = (goalId, goalStatus) => {
    fetch(`http://127.0.0.1:5000/${goalType}/goals?user_id=1&goal_id=${goalId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // Update the state to remove the deleted goal
          setGoalsByStatus((prevGoals) => {
            const newGoals = { ...prevGoals };
            newGoals[goalStatus] = (newGoals[goalStatus] || []).filter(g => g.goal_id !== goalId);
            return newGoals;
          });
          console.log('Goal deleted successfully');
        } else {
          console.error('Error deleting goal');
        }
      })
      .catch((error) => {
        console.error('Error deleting goal:', error);
      });
  };

  const moveGoal = (goal, newStatus) => {
    // Update the status of the goal
    const updatedGoal = {
      ...goal,
      goal_status: newStatus,
    };
  
    fetch(`http://127.0.0.1:5000/${goalType}/goals?user_id=1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedGoal),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Goal status updated:', data);
        // Update the state to reflect the moved goal
        setGoalsByStatus((prevGoals) => {
          const newGoals = { ...prevGoals };
          // Remove the goal from the old status list
          const oldStatusGoals = newGoals[goal.goal_status] || [];
          newGoals[goal.goal_status] = oldStatusGoals.filter(g => g.goal_id !== goal.goal_id);
  
          // Add the updated goal to the new status list
          if (!newGoals[newStatus]) {
            newGoals[newStatus] = [];
          }
          newGoals[newStatus].push(updatedGoal);
  
          return newGoals;
        });
      })
      .catch((error) => {
        console.error('Error updating goal status:', error);
      });
  };
  
  const renderGoalsByStatus = (status) => {
    const goals = goalsByStatus[status] || [];
    return goals.map((goal) => (
      <Grid item xs={12} sm={6} md={4} key={goal.goal_id}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{goal.goal_title}</Typography>
              <Box>
                <IconButton size="small" onClick={() => handleEditGoal(goal)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteGoal(goal.goal_id, goal.goal_status)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {goal.goal_description}
            </Typography>
          </CardContent>
          <CardActions>
            {status === 'Completed' && (
              <>
                <Button size="small" onClick={() => moveGoal(goal, 'In Progress')}>
                  Move to In Progress
                </Button>
                <Button size="small" onClick={() => moveGoal(goal, 'Not started')}>
                  Move to Not Started
                </Button>
              </>
            )}
            {status === 'Not started' && (
              <>
                <Button size="small" onClick={() => moveGoal(goal, 'In Progress')}>
                  Move to In Progress
                </Button>
                <Button size="small" onClick={() => moveGoal(goal, 'Completed')}>
                  Move to Completed
                </Button>
              </>
            )}
            {status === 'In Progress' && (
              <>
                <Button size="small" onClick={() => moveGoal(goal, 'Completed')}>
                  Move to Completed
                </Button>
                <Button size="small" onClick={() => moveGoal(goal, 'Not started')}>
                  Move to Not Started
                </Button>
              </>
            )}
          </CardActions>
        </Card>
      </Grid>
    ));
  };
  
  // const renderGoalsByStatus = (status) => {
  //   const goals = goalsByStatus[status] || [];
  //   return goals.map((goal) => (
  //     <Grid item xs={12} sm={6} md={4} key={goal.goal_id}>
  //       <Card>
  //         <CardContent>
  //           <Box display="flex" justifyContent="space-between" alignItems="center">
  //             <Typography variant="h6">{goal.goal_title}</Typography>
  //             <Box>
  //               <IconButton size="small" onClick={() => handleEditGoal(goal)}>
  //                 <EditIcon />
  //               </IconButton>
  //               <IconButton size="small" onClick={() => handleDeleteGoal(goal.goal_id, goal.goal_status)}>
  //                 <DeleteIcon />
  //               </IconButton>
  //             </Box>
  //           </Box>
  //           <Typography variant="body2" color="text.secondary">
  //             {goal.goal_description}
  //           </Typography>
  //         </CardContent>
  //         <CardActions>
  //           <Button size="small">Move to In Progress</Button>
  //           <Button size="small">Move to Completed</Button>
  //         </CardActions>
  //       </Card>
  //     </Grid>
  //   ));
  // };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'center',
        margin: '100px auto',
        padding: '0 16px',
        maxWidth: '800px',
      }}
    >
      <Button sx={{ ml: 'auto', textTransform: 'none' }} startIcon={<CircleIconWrapper>+</CircleIconWrapper>} onClick={handleClickOpen}>
        Add Goals
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Set your next {goalType} Goal!</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="What's your next goal?"
            fullWidth
            variant="outlined"
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Describe your goal"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={goalDescription}
            onChange={(e) => setGoalDescription(e.target.value)}
          />
          <FormControl fullWidth sx={{ marginTop: '10px' }}>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={goalStatus}
              label="Status"
              onChange={(e) => setGoalStatus(e.target.value)}
            >
              <MenuItem value={'Not started'}>Not Started</MenuItem>
              <MenuItem value={'In Progress'}>In Progress</MenuItem>
              <MenuItem value={'Completed'}>Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" sx={{ textTransform: 'none', fontSize: 20 }}>
            Cancel
          </Button>
          <Button onClick={editingGoal ? handleSaveEdit : handleCreateGoal} color="primary" sx={{ textTransform: 'none', fontSize: 20 }}>
            {editingGoal ? 'Save Changes' : "Let's do this!"}
          </Button>
        </DialogActions>
      </Dialog>
      <Accordion>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <NotStartedIcon sx={{ marginRight: 1 }} />
          <Typography>Not Started</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {renderGoalsByStatus('Not started')}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <AccessTimeIcon sx={{ marginRight: 1 }} />
          <Typography>In Progress</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {renderGoalsByStatus('In Progress')}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <CheckCircleIcon sx={{ marginRight: 1 }} />
          <Typography>Completed</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {renderGoalsByStatus('Completed')}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}