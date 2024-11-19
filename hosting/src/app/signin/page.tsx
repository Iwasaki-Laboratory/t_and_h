'use client';
import { Link as MuiLink } from '@mui/material';
import NextLink, { LinkProps } from 'next/link';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useState, useEffect } from 'react';
import { signInWithEmail, onAuthStateChanged } from '../lib/firebase/auth';
import { useRouter } from "next/navigation";

let InputMailAddress = '';
let InputPassword = '';

export default function Home() {
  const router = useRouter();
  const [InputError, setInputError] = useState(false);

  /**
   * サインインを実行
   */
  const handleSignIn = async () => {

    const result = await signInWithEmail(InputMailAddress, InputPassword);

    if (result !== null) {
      // 入力エラー発生
      setInputError(true);
      return;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authUser => {
      // ログインされたらトップページへ遷移
      if (authUser) router.push('/');
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <Box sx={{ width:1/2, mr:"auto", ml:"auto" }}>
      { InputError && (<Alert severity="error" variant="filled">メールアドレスまたはパスワードに誤りがあります。</Alert>)}
      <h2>サインイン</h2>
      <Stack spacing={2}>
        <TextField id="mail-address" label="メールアドレス" onChange={e=>InputMailAddress=e.target.value} />
        <TextField id="password" label="パスワード" type="password" onChange={e=>InputPassword=e.target.value} />
        <Button variant="contained" onClick={handleSignIn}>サインイン</Button>
      </Stack>
    </Box>
    <Box sx={{ width:1/2, mr:"auto", ml:"auto", mt:5 }}>
      ※新規の方は、
      <MuiLink href={'/regist-user'}>こちら</MuiLink>
      から登録してください。
    </Box>
    </>
    );
}
