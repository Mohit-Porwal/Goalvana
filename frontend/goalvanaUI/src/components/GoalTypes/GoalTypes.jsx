import React from 'react';
import { Box, Card, CardContent, Typography, Divider, Button, IconButton } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

const Goals = ({ goalTypeId, goalType }) => { // Destructure id and title here

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${goalType}/goals`, { state: { goalTypeId: goalTypeId } });
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
            <IconButton size="small" onClick={() => handleEdit(item)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => handleDelete(item)}>
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

  console.log("Goal Types " + JSON.stringify(goalTypes));

  return (
    <Box sx={{ flexGrow: 1, p: 3, mx: 'auto', maxWidth: '1200px' }}>
      <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {/* Persistent plus button at the start */}
        <Grid item xs={4}>
          <Card variant="outlined" sx={{ width: 315, height: 215, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
            <IconButton color="primary" onClick={handleOpenDialog}>
              <AddIcon />
            </IconButton>
          </Card>
        </Grid>
        {goalTypes.map((goal, index) => (
          <Grid item xs={4} key={index}>
            {/* Pass id and title directly to Goals component */}
            <Goals goalTypeId={goal.goal_type_id} goalType={goal.goalType} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
