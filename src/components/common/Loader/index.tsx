import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const CircularLoader = ({ size }: { size?: number }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

CircularLoader.defaultProps = {
  size: 40,
};

export default CircularLoader;
