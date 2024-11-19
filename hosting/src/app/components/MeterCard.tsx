"use client";
import { useEffect, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { CardContent, Grid2 } from '@mui/material';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { MeterStatus } from '@app/lib/dbUtils';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import Link from '@mui/material/Link';
import { getDb } from '@app/lib/firebase/clientApp';

const db = getDb();

export default function Home(props : { meter: {id: string, meter: MeterStatus}, uid: string}) {

  const [meter, setMeter] = useState(props.meter.meter);
  const dt = new Date(meter.lastUpdateTime.seconds * 1000);
  const lastUpdateTime = dt.getFullYear() + '/' + 
                        (dt.getMonth()+1).toString().padStart(2, '0') + '/' + 
                        dt.getDate().toString().padStart(2, '0') + ' ' +
                        dt.getHours().toString().padStart(2, '0') + ':' +
                        dt.getMinutes().toString().padStart(2, '0');
  const meterDoc = doc(db, `users/${props.uid}/meters/${props.meter.id}`);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      meterDoc,
      doc => {
        const t = doc.data() as MeterStatus;
        setMeter(t);
      }
    )

    return () => unsubscribe();
  }, []);

  return (
    <Card variant="outlined" sx={{ width: 345 }}>
    <CardHeader title={meter.deviceName} action={<IconButton><Link href={`sb-regist-device/${props.meter.id}`}><EditIcon /></Link></IconButton>} />
    <CardContent>
      <Grid2 container spacing={2}>
        <Grid2 size={1} sx={{textAlign: 'right'}}><DeviceThermostatIcon/></Grid2>
        <Grid2 size={3}>{ meter.celsius }℃</Grid2>
        <Grid2 size={1} sx={{textAlign: 'right'}}><WaterDropIcon/></Grid2>
        <Grid2 size={3}>{ meter.humidity }%</Grid2>
      </Grid2>
      <Grid2 container spacing={2}>
        <Grid2 size={3} sx={{textAlign: 'right'}}>最終更新</Grid2>
        <Grid2 size={6}>{ lastUpdateTime }</Grid2>
      </Grid2>
    </CardContent>
  </Card>
  )
}