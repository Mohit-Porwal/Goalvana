import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Divider, Button, IconButton } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

const Goals = ({ goalTypeId, goalType, onEdit, onDelete }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/${goalType}/goals`, { state: { goalTypeId: goalTypeId, goalType: goalType } });
  };

  const handleEdit = async () => {
    const newGoalType = prompt("Enter new goal type name:", goalType);
    if (newGoalType && newGoalType !== goalType) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/goalTypes?user_id=1`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            goal_type_id: goalTypeId,
            goal_type: newGoalType,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          alert("Goal type updated successfully");
          onEdit(goalTypeId, newGoalType); // Trigger state update
        } else {
          const errorData = await response.json();
          alert(`Error updating goal type: ${errorData.error}`);
        }
      } catch (error) {
        alert(`Error: ${error}`);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the goal type: "${goalType}"?`)) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/goalTypes?user_id=1`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            goal_type_id: goalTypeId,
          }),
        });

        if (response.ok) {
          alert("Goal type deleted successfully");
          onDelete(goalTypeId); // Trigger state update
        } else {
          const errorData = await response.json();
          alert(`Error deleting goal type: ${errorData.error}`);
        }
      } catch (error) {
        alert(`Error: ${error}`);
      }
    }
  };

  return (
    <Card variant="outlined" sx={{ width: 300, height: 200, textAlign: 'center', p: 1, borderRadius: '10px' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography sx={{ textAlign: 'left' }}>
            <Button onClick={handleClick} sx={{ color: 'black', fontWeight: 'bold', fontSize: 22, textTransform: 'none' }}>
              {goalType}
            </Button>
          </Typography>
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            <IconButton size="small" onClick={handleEdit}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mt: 1 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default function GoalTypes({ goalTypes, handleOpenDialog }) {
  const [localGoalTypes, setLocalGoalTypes] = useState(goalTypes);

  // Synchronize local state with the initial goalTypes prop
  useEffect(() => {
    if (goalTypes && goalTypes.length > 0) {
      setLocalGoalTypes(goalTypes);
    }
  }, [goalTypes]);

  const handleEditGoalType = (goalTypeId, newGoalType) => {
    setLocalGoalTypes(prevGoalTypes =>
      prevGoalTypes.map(goal =>
        goal.goal_type_id === goalTypeId ? { ...goal, goalType: newGoalType } : goal
      )
    );
  };

  const handleDeleteGoalType = (goalTypeId) => {
    setLocalGoalTypes(prevGoalTypes =>
      prevGoalTypes.filter(goal => goal.goal_type_id !== goalTypeId)
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, mx: 'auto', maxWidth: '1200px' }}>
      <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={4}>
          <Card variant="outlined" sx={{ width: 315, height: 215, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
            <IconButton color="primary" onClick={handleOpenDialog}>
              <AddIcon />
            </IconButton>
          </Card>
        </Grid>
        {localGoalTypes.map((goal, index) => (
          <Grid item xs={4} key={index}>
            <Goals
              goalTypeId={goal.goal_type_id}
              goalType={goal.goalType}
              onEdit={handleEditGoalType}
              onDelete={handleDeleteGoalType}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
