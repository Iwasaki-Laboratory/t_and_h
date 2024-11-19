import type { Metadata } from "next";
import CssBaseline from '@mui/material/CssBaseline';
import { headers } from 'next/headers';
import { Header } from './components/Header';
import { redirect } from 'next/navigation'
import * as React from 'react';
import { getAuthenticatedAppForUser } from './lib/firebase/serverApp';
import { ThemeProviderContext } from './theme/ThemeContext';
import { getInitialTheme } from "./theme/themeUtil";

import { User } from "firebase/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "温度＆湿度",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { currentUser } = await getAuthenticatedAppForUser();

  // 現在のURLを取得
  const header_url = headers().get('x-url') || "";

  // サインインしていなければ、サインイン画面へ
  if (currentUser) {
    // 現在のURL:サインイン
    if (header_url.lastIndexOf("/signin") > 0
        || header_url.lastIndexOf("/regist-user") > 0) {
      redirect("/");
    }
  }
  else {
    // 現在のURL:サインイン以外
    if (header_url.lastIndexOf("/signin") <= 0
        && header_url.lastIndexOf("/regist-user") <= 0) {
      redirect("/signin");
    }
  }

  const initialTheme = getInitialTheme();

  return (
    <ThemeProviderContext initialTheme={initialTheme}>
    <html lang="ja">
      <body>
        <CssBaseline />
        <Header initialUser={currentUser?.toJSON() as User} />
        {children}
      </body>
    </html>
    </ThemeProviderContext>
  );
}