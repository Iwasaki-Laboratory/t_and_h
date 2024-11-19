
import { getAuthenticatedAppForUser } from '@app/lib/firebase/serverApp';
import { Stack } from '@mui/material';
import { getDevices, getSbToken, User } from '@app/lib/dbUtils';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MeterCard from '@app/components/MeterCard';

export default async function Home() {

  let u : User | null = null;

  const { currentUser } = await getAuthenticatedAppForUser();

  if (currentUser) {
    u = await getSbToken(currentUser.uid);
  }

  const meters = currentUser ? await getDevices(currentUser.uid) : null;

  return (
      <Box sx={{ padding: 5}}>
        { (!u?.sbToken || !u?.sbSecretKey) && (<Alert severity="error" variant="filled">初めにSwitch-BotのTokenとSecret Keyを設定してください。</Alert>)}
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row'}} flexWrap={'wrap'}>
          { meters && meters.map(meter => <MeterCard meter={meter} key={meter.id} uid={currentUser?.uid ?? ''} />)}
        </Stack>
      </Box>
      );
}
