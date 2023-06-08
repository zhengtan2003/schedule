import AtomicSpinner from 'atomic-spinner';

const Loading = () => {
  return (
    <div
      style={{
        height: '100%',
        minHeight: '600px',
      }}
      className={'flex justify-center items-center'}
    >
      <AtomicSpinner />
    </div>
  );
};

export default Loading;
