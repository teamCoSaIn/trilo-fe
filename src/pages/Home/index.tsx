import axios from '@/api/core';

const Home = () => {
  return (
    <div>
      <h1>홈 페이지입니다.</h1>
      <button
        type="button"
        onClick={() => {
          // console.log('요청!');
          axios.get('/test', { requireAuth: true });
        }}
      >
        만료AT받기
      </button>
      <br />
      <button
        type="button"
        onClick={() => {
          // console.log('요청!');
          axios.get('/test2', { requireAuth: true });
        }}
      >
        버튼
      </button>
    </div>
  );
};

export default Home;
