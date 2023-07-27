import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface IFallback{
  error: {
    name: string;
    message: string;
  },
  resetBoundary: any
}

const ErrorFallback = ({ error, resetBoundary }: IFallback) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error?.message}</pre>
      <button onClick={resetBoundary}>Try again</button>
    </div>
  );
};

export default ErrorFallback; 
