import React from "react";

export default function GoalCard() {
    return (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{goalTitle}</Typography>
              <Box>
                <IconButton size="small" onClick={() => console.log(`Edit Task ${taskNumber}`)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => console.log(`Delete Task ${taskNumber}`)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {goalDescription}
            </Typography>
          </CardContent>
          <CardActions>
            {actions}
          </CardActions>
        </Card>
    );
}