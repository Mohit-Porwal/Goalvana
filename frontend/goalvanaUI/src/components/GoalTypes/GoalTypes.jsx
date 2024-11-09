import React from 'react';
import { Box, Card, CardContent, Typography, Divider, Button } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';

const goals = [
  { title: 'Professional'},
  { title: 'Health' },
  { title: 'Personal'},
  { title: 'Professional'},
  { title: 'Health' },
  { title: 'Personal'},
  { title: 'Professional'},
];

const Goals = ({ title }) => (
  <Card variant="outlined" sx={{ width: 300, height: 200, textAlign: 'center', p: 1, borderRadius: '10px' }}>
    <CardContent>
      <Typography sx={{ textAlign: 'left' }}>
        <Button sx={{color: 'black', fontWeight: 'bold', fontSize: 22, textTransform: 'none' }}>{title}</Button>
      </Typography>
      <Divider sx={{ mt: 1 }} />
    </CardContent>
  </Card>
);

const GoalsGrid = () => (
  <Box sx={{ flexGrow: 1, p: 3, mx: 'auto', maxWidth: '1200px' }}>
    <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {goals.map((goal, index) => (
        <Grid size={4} key={index}>
          <Goals {...goal} />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default GoalsGrid;

      {/* {progress && (
        <Typography variant="h4" color="primary" sx={{ mt: 2 }}>
          {progress}
        </Typography>
      )}
      {unit && (
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {unit}
        </Typography>
      )}
      {button && (
        <Button variant="contained" sx={{ mt: 2 }}>
          Mark as Done
        </Button>
      )} */}

