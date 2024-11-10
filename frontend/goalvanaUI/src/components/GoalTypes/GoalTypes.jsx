// import React from 'react';
// import { Box, Card, CardContent, Typography, Divider, Button } from '@mui/material';
// import { Grid2 as Grid } from '@mui/material';
// import { useNavigate } from 'react-router-dom';


// const Goals = ({ goalTypes }) => {

//   const { id, title } = goalTypes;

//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate(`/${title}/goals`);
//   };

//   return(
//     <Card variant="outlined" sx={{ width: 300, height: 200, textAlign: 'center', p: 1, borderRadius: '10px' }}>
//       <CardContent>
//         <Typography sx={{ textAlign: 'left' }}>
//           <Button onClick={handleClick} sx={{color: 'black', fontWeight: 'bold', fontSize: 22, textTransform: 'none' }}>{title}</Button>
//         </Typography>
//         <Divider sx={{ mt: 1 }} />
//       </CardContent>
//     </Card>
//   )

// }

// export default function GoalTypes ( { goalTypes } ) {

//   console.log("Goal Types "+JSON.stringify(goalTypes));

//   return(
//     <Box sx={{ flexGrow: 1, p: 3, mx: 'auto', maxWidth: '1200px' }}>
//       <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//         {goalTypes.map((goal, index) => (
//           <Grid size={4} key={index}>
//             <Goals id={goal.id} title={goal.goalType} />
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// }


import React from 'react';
import { Box, Card, CardContent, Typography, Divider, Button } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Goals = ({ goalTypeId, goalType }) => { // Destructure id and title here

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${goalType}/goals`, { state: { goalTypeId: goalTypeId } });
  };

  return (
    <Card variant="outlined" sx={{ width: 300, height: 200, textAlign: 'center', p: 1, borderRadius: '10px' }}>
      <CardContent>
        <Typography sx={{ textAlign: 'left' }}>
          <Button onClick={handleClick} sx={{ color: 'black', fontWeight: 'bold', fontSize: 22, textTransform: 'none' }}>
            {goalType}
          </Button>
        </Typography>
        <Divider sx={{ mt: 1 }} />
      </CardContent>
    </Card>
  );
};

export default function GoalTypes({ goalTypes }) {

  console.log("Goal Types " + JSON.stringify(goalTypes));

  return (
    <Box sx={{ flexGrow: 1, p: 3, mx: 'auto', maxWidth: '1200px' }}>
      <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {goalTypes.map((goal, index) => (
          <Grid item xs={4} key={index}> {/* 'item' should be used for Grid item */}
            {/* Pass id and title directly to Goals component */}
            <Goals goalTypeId={goal.goal_type_id} goalType={goal.goalType} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
