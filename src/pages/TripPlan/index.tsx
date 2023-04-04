import { useParams } from 'react-router-dom';

const TripPlan = () => {
  const { id } = useParams();

  return <div>{id}번 TripCard에 대한 Plan 페이지입니다.</div>;
};

export default TripPlan;
