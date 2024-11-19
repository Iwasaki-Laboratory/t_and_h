"use client";
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from 'react';
import { setCookie, deleteCookie } from '@app/lib/cookieUtils';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SettingsIcon from '@mui/icons-material/Settings';
import { useThemeContext } from '../theme/ThemeContext';
import FormControlLabel from '@mui/material/FormControlLabel';

import {
	signOut,
  onAuthStateChanged
} from "../lib/firebase/auth";
import { getIdToken, User } from 'firebase/auth';

function NavigationList(props : { onSignOut: () => void}) {
  const router = useRouter();

  const handleSingOut = async() => {
    props.onSignOut();
    await signOut();
    router.push('/signin');
  }

  return (
  <List sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ flexGrow: 1 }}>
    {[
      { name: 'ダッシュボード', 'segment': '/', icon: <DashboardIcon />},
      { name: '認証設定', 'segment': '/sb-setting', icon: <SettingsIcon />},
      { name: 'メーター登録', 'segment': '/sb-regist-device', icon: <AddBoxIcon />}
      ].map((obj) => (
      <ListItem key={obj.name} disablePadding>
        <ListItemButton href={obj.segment ? obj.segment : ''}>
          <ListItemIcon>
            {obj.icon}
          </ListItemIcon>
          <ListItemText primary={obj.name} />
        </ListItemButton>
      </ListItem>
    ))}
  </Box>
  {/* サインアウトボタン */}
  <ListItem disablePadding sx={{mb: 2}}>
    <ListItemButton onClick={handleSingOut}>
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <ListItemText primary="サインアウト" />
    </ListItemButton>
  </ListItem>  
  </List>);
}

var tokenUpdateIntervalId : any | null = null;
const tokenUpdateIntervalMs = 45 * 60 * 1000; // 45分

function updateAuthIdToken(authUser: User) {
  getIdToken(authUser).then(authIdToken => {
    setCookie('authIdToken', authIdToken, 60 * 60);
  });
}

var signinUser: User | null = null;

export function Header({initialUser } : {initialUser: User}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authUser => {
      setUser(authUser);

      if (authUser) {
        // ログイン中
        signinUser = authUser;
        // ユーザーのトークンを定期的に更新
        updateAuthIdToken(signinUser);
        tokenUpdateIntervalId = setInterval(() => {
          if (signinUser) updateAuthIdToken(signinUser);
        }, tokenUpdateIntervalMs) as any;
      }
      else {
        // 未ログイン中
        signinUser = null;

        deleteCookie('authIdToken');

        if (tokenUpdateIntervalId) {
          clearInterval(tokenUpdateIntervalId);
        }

        tokenUpdateIntervalId = null;
      }
    })

    return () => unsubscribe()
  }, []);

  const handleSignOut = () => { setOpen(false)};
  const NavigationListMemo = useMemo(() => <NavigationList onSignOut={handleSignOut} /> , []);

  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          { user &&
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={()=>{setOpen(!open); }}
            >
              <MenuIcon />
            </IconButton>
          }
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            温度＆湿度
          </Typography>
          <FormControlLabel control={<Switch defaultChecked={isDarkMode} onClick={() => {toggleTheme()}} />} label="ダークモード" />
          <div style={{marginLeft: 20}}>{user?.displayName}</div>
        </Toolbar>
      </AppBar>
      { user &&
        <Drawer
          anchor="left"
          open={open}
          onClose={() => {setOpen(false)}}
        >
          { NavigationListMemo }
        </Drawer>
      }
  </>
  );
}