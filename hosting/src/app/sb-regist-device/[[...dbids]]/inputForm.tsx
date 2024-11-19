"use client"

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { SubmitButton } from '@app/components/SubmitButton';
import { useFormState } from 'react-dom';
import { registSwitchBotDevice, ServerResponse } from './action';

let initialResponse:ServerResponse = { message: '', error: false, dbid: null};

export function InputForm(props : {dbid: string | null, macAddress: string, deviceName: string} ) {

  let dbid = undefined;
  let [formState, formAction] = useFormState(registSwitchBotDevice, initialResponse);
  
  if (formState.dbid) {
    dbid = formState.dbid;
  }
  else if (props.dbid) {
    dbid = props.dbid;
  }

  return (
    <form action={formAction} autoComplete='off'>
      <input type="hidden" name="dbid" value={dbid} />
      <Box sx={{ width:1/2, mr:"auto", ml:"auto" }}>
        { formState.message && (<Alert severity={formState.error ? "error" : "success"} variant="filled">{ formState.message }</Alert>)}
        <h2>Switch-Bot デバイス情報 【{dbid ? '変更' : '新規登録'}】</h2>
        <Stack spacing={2}>
          <TextField id="mac-address" label="MAC Address" name="mac_address" defaultValue={props.macAddress} />
          <TextField id="device-name" label="名称" name="device_name" defaultValue={props.deviceName} />
          <SubmitButton />
        </Stack>
      </Box>
    </form>
  );
}
