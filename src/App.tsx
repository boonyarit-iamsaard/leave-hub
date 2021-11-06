import { FC } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Button, Stack } from '@mui/material';

const App: FC = () => {
  return (
    <div>
      <p>Bangkok Engineering - Leave Hub</p>

      <Stack direction="row" spacing={2} sx={{ p: 2 }}>
        <Button variant="outlined" startIcon={<DeleteIcon />}>
          Delete
        </Button>
        <Button variant="contained" endIcon={<SendIcon />}>
          Send
        </Button>
      </Stack>
    </div>
  );
};

export default App;
