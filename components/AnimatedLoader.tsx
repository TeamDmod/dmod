export default function AnimatedLoader() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      style={{
        margin: 'auto',
        display: 'block',
        shapeRendering: 'auto',
      }}
      width='254px'
      height='254px'
      viewBox='0 0 100 100'
      preserveAspectRatio='xMidYMid'
    >
      <circle cx='50' cy='50' r='30' strokeWidth='4' stroke='#1d3f72' strokeDasharray='47.12388980384689 47.12388980384689' fill='none' strokeLinecap='round'>
        <animateTransform attributeName='transform' type='rotate' repeatCount='indefinite' dur='0.4166666666666667s' keyTimes='0;1' values='0 50 50;360 50 50' />
      </circle>
    </svg>
  );
}
