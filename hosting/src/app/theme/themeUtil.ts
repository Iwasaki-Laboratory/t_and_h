import 'server-only';

import { cookies } from 'next/headers';

export const getInitialTheme = () => {
  const themeCookie = cookies().get('isDarkMode');
  return themeCookie ? themeCookie.value === 'true' : false;
};