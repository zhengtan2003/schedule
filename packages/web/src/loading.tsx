import { Player } from '@lottiefiles/react-lottie-player';

const Loading = () => {
  return (
    <div
      style={{
        height: '100%',
        minHeight: '600px',
      }}
      className={'flex justify-center items-center'}
    >
      <Player
        loop
        autoplay
        src="/lottie.json"
        style={{ height: '300px', width: '300px' }}
      />
    </div>
  );
};

export default Loading;
