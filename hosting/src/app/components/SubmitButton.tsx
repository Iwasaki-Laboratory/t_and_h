"use client"

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';

import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
      <Box sx={{ m: 1, position: 'relative', width: '100%' }}>
      <Button sx={{width: '100%'}} variant="contained" type="submit" disabled={pending}>登録</Button>
      {pending && (
          <CircularProgress
            size={24}
            sx={{
              color: green[500],
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
            />)
      }
      </Box>
  );
}

