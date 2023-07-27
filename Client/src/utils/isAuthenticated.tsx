import __ from 'lodash';

function isAuthenticated() {
  const token: string | null = window.localStorage.getItem('TOKEN');
  let Authenticated: boolean = false;

  if (typeof window !== 'undefined' && !__.isNil(token)) {
    Authenticated = true;
  }

  return Authenticated;
}

export default isAuthenticated;
