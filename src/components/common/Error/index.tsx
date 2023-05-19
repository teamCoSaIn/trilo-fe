import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import { FallbackProps } from 'react-error-boundary';
import styled from 'styled-components';

const Error = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <AlertBox
      severity="error"
      action={
        <Button
          color="error"
          variant="outlined"
          size="small"
          onClick={() => resetErrorBoundary()}
        >
          다시 시도
        </Button>
      }
    >
      <AlertTitle sx={{ fontWeight: '700' }}>Error</AlertTitle>
      {error.message}
    </AlertBox>
  );
};

const AlertBox = styled(Alert)`
  margin: auto auto;
  display: flex;
  align-items: center;
  .MuiAlert-action {
    padding-top: 0;
    margin: 0;
  }
`;

export default Error;
