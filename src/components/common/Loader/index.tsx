import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const CircularLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default CircularLoader;
