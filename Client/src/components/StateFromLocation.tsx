type MyState = { success: boolean; message: string };
type Mycode = { passCode: string; status: string };

function isStateValid(state: any): state is MyState {
  if (!state) return false; // Make sure it's not null
  if (typeof state !== 'object') return false;
  if (typeof state.message !== 'string') return false;
  if (typeof state.success !== 'boolean') return false;
  return true;
}

function isCodeValid(state: any): state is Mycode {
  if (!state) return false; // Make sure it's not null
  if (typeof state !== 'object') return false;
  if (typeof state.passCode !== 'string') return false;
  if (typeof state.status !== 'string') return false;
  return true;
}

export { isStateValid, isCodeValid };
