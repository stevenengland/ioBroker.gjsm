import * as React from 'react';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import AutomationList from './AutomationList';

function MainLayout() {
  const items = ['item1', 'item2', 'item3'];
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={12}>
        <Grid item xs={3}>
          <AutomationList items={items} />
        </Grid>
        <Grid item xs={9}></Grid>
      </Grid>
    </Box>
  );
}

export default MainLayout;
