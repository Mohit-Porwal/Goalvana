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
import { useState } from 'react';
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

export default function CustomizedAccordions() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setStatus(event.target.value);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'center',
        margin: '100px auto', // Top margin and center horizontally
        padding: '0 16px', // Horizontal padding
        maxWidth: '800px', // Optional: set max width for the accordion container
      }}
    >
      <Button sx={{ml: 'auto', textTransform: 'none'}} startIcon={<CircleIconWrapper>+</CircleIconWrapper>} onClick={handleClickOpen}>Add Goals</Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Set your next Goal!</DialogTitle>
        <DialogContent>
          <TextField
              autoFocus
              margin="dense"
              label="What's your next goal?"
              fullWidth
              variant="outlined"
          />
          <TextField
              margin="dense"
              label="Describe your goal"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
          />
          <FormControl fullWidth sx={{marginTop: '10px'}}>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value={'Not Started'}>Not Started</MenuItem>
              <MenuItem value={'In Progress'}>In Progress</MenuItem>
              <MenuItem value={'Completed'}>Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" sx={{ textTransform: 'none', fontSize: 20 }}>
              Cancel
          </Button>
          <Button onClick={handleClose} color="primary" sx={{ textTransform: 'none', fontSize: 20 }}>
              Let's do this!
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
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">Task {item}</Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleEdit(item)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(item)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Description for task {item}.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Move to In Progress</Button>
                    <Button size="small">Move to Completed</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
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
            {[4, 5, 6, 7, 8].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">Task {item}</Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleEdit(item)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(item)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Description for task {item}.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Move to Not Started</Button>
                    <Button size="small">Move to Completed</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
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
            {[6, 7, 8].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">Task {item}</Typography>
                      <Box>
                        <IconButton size="small" onClick={() => handleEdit(item)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(item)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Description for task {item}.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Move to Not Started</Button>
                    <Button size="small">Move to In Progress</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
