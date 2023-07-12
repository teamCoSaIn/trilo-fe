import CircularLoader from '@/components/common/CircularLoader/index';
import DimLayer from '@/components/common/DimLayer';

const DimLoader = () => {
  return (
    <DimLayer justifyCenter alignCenter>
      <CircularLoader />
    </DimLayer>
  );
};

export default DimLoader;
