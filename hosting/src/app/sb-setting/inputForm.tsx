"use client"

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { SubmitButton } from '@app/components/SubmitButton';
import { useFormState } from 'react-dom';
import { setSwitchBotAuthInfo } from './action';

let initialResponse = { message: '', error: false};


export function InputForm(props : {token: string, secretKey: string} ) {

  const [formState, formAction] = useFormState(setSwitchBotAuthInfo, initialResponse);

  return (
    <form action={formAction} autoComplete='off'>
      <Box sx={{ width:1/2, mr:"auto", ml:"auto" }}>
        { formState.message && (<Alert severity={formState.error ? "error" : "success"} variant="filled">{ formState.message}</Alert>)}
        <h2>Switch-Bot 認証情報</h2>
        <Stack spacing={2}>
          <TextField id="token" label="Token" name="token" defaultValue={props.token} />
          <TextField id="secret-key" label="Secret Key" name="secret_key" defaultValue={props.secretKey} />
          <SubmitButton />
        </Stack>
      </Box>
    </form>
  );
}
