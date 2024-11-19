'use client';
import { Link as MuiLink } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndNickname, onAuthStateChanged } from '../lib/firebase/auth';
import { useRouter } from "next/navigation";

let InputMailAddress = '';
let InputPassword = '';
let InputNickname = '';

export default function Home() {
  const router = useRouter();
  const [InputError, setInputError] = useState(false);

  /**
   * サインインを実行
   */
  const handleRegist = async () => {

    const result = await createUserWithEmailAndNickname(InputMailAddress, InputPassword, InputNickname);

    if (result === null) {
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
      { InputError && (<Alert severity="error" variant="filled">入力に誤りがあります。</Alert>)}
      <h2>ユーザー登録</h2>
      <Stack spacing={2}>
        <TextField id="nickname" label="ニックネーム" onChange={e=>InputNickname=e.target.value} />
        <TextField id="mail-address" label="メールアドレス" onChange={e=>InputMailAddress=e.target.value} />
        <TextField id="password" label="パスワード" type="password" onChange={e=>InputPassword=e.target.value} />
        <Button variant="contained" onClick={handleRegist}>登録</Button>
      </Stack>
    </Box>
    <Box sx={{ width:1/2, mr:"auto", ml:"auto", mt:5 }}>
    ※登録済の方は、
    <MuiLink href={'/signin'}>こちら</MuiLink>
    からサインインしてください。
    </Box>
    </>
  );
}
