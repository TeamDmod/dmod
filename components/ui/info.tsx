import 'tailwindcss/tailwind.css'; // temp

import ReactDOM from 'react-dom';

type domData = { title: string; content: string };
const infoDom = {
  getElementContent({ title, content }: domData) {
    return (
      <div className='content-isahf'>
        <div
          // @ts-expect-error
          style={{ '--animation-hf': 'animatebgin' }}
          className='main-content-sofd'
          id='conetntogsdg'
          onClick={elm => {
            const holder = document.getElementById('conetntogsdg');
            // const cancel = document.getElementById('cancelosjf');

            if (elm.target === holder) {
              elm.preventDefault();
              this.destroy();
            }
          }}>
          {/* @ts-expect-error */}
          <div className='info-model' id='model-sdfh' style={{ '--animation-dp': 'animatedINmodle' }}>
            <div className='content-g8y'>
              <div>
                <h1>
                  <b>{title}</b>
                </h1>
              </div>
              {/* eslint-disable-next-line react/no-danger */}
              <p dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        </div>
      </div>
    );
  },
  getelm() {
    return document.getElementById('__info_j6t');
  },
  create({ title, content }: domData) {
    const elm = this.getelm();
    elm?.classList?.add('__jksnv');
    ReactDOM.render(
      this.getElementContent({
        title,
        content,
      }),
      elm
    );
  },
  destroy() {
    const elm = this.getelm();

    document.getElementById('conetntogsdg')?.style?.setProperty('--animation-hf', 'animatebgout');
    document.getElementById('model-sdfh')?.style?.setProperty('--animation-dp', 'animatedOUTmodle');

    // Give time for the out animation to play
    setTimeout(() => {
      elm?.classList?.remove('__jksnv');
      ReactDOM.unmountComponentAtNode(elm);
    }, 200);
  },
};

interface props extends domData {}

export default function InfoPopUp({ content, title }: props) {
  return (
    <div title={title}>
      <svg
        className='transition duration-200 cursor-pointer hover:opacity-75'
        onClick={() => infoDom.create({ content, title })}
        width='20'
        height='20'
        viewBox='0 0 34 36'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M17.6523 13.5371L17.8379 13.6543C17.7663 14.403 17.7305 15.9036 17.7305 18.1562V24.2793C17.7305 24.4225 17.7435 24.8848 17.7695 25.666C17.7956 26.4408 17.8216 26.8932 17.8477 27.0234C17.8802 27.1536 17.9258 27.248 17.9844 27.3066C18.043 27.3652 18.1146 27.4043 18.1992 27.4238C18.2839 27.4368 18.6354 27.4629 19.2539 27.502L19.3418 27.5801V27.9902L19.2637 28.0781C18.4499 28.026 17.6654 28 16.9102 28C16.1615 28 15.3802 28.026 14.5664 28.0781L14.4785 27.9902V27.5801L14.5664 27.502C15.1979 27.4629 15.5527 27.4336 15.6309 27.4141C15.7155 27.3945 15.7871 27.3555 15.8457 27.2969C15.9108 27.2318 15.9531 27.1374 15.9727 27.0137C15.9987 26.8835 16.0247 26.4635 16.0508 25.7539C16.0833 25.0378 16.0996 24.4974 16.0996 24.1328V19.0742L16.0605 17.0039C16.041 16.2812 16.0182 15.7799 15.9922 15.5C15.9727 15.2201 15.9434 15.054 15.9043 15.002C15.8652 14.9499 15.7969 14.9108 15.6992 14.8848C15.6016 14.8587 15.2077 14.8457 14.5176 14.8457L14.4297 14.7578V14.3477L14.5078 14.2598C15.7513 14.1165 16.7995 13.8757 17.6523 13.5371Z'
          fill='white'
        />
        <path
          d='M14.8633 11.8125C15.2669 11.1419 15.5566 10.6374 15.7324 10.2988C15.9082 9.96029 16.0612 9.60221 16.1914 9.22461C16.3281 8.85352 16.416 8.56706 16.4551 8.36523C16.5007 8.16341 16.5625 7.74674 16.6406 7.11523C16.6732 7.10221 16.8555 7.05664 17.1875 6.97852C17.6432 6.86784 18.125 6.7181 18.6328 6.5293L18.877 6.80273C18.0501 8.72331 17.0703 10.3477 15.9375 11.6758L15.1074 12.0566L14.8633 11.8125Z'
          fill='white'
        />
        <path
          d='M33.5 18C33.5 27.6923 26.0862 35.5 17 35.5C7.91384 35.5 0.5 27.6923 0.5 18C0.5 8.30771 7.91384 0.5 17 0.5C26.0862 0.5 33.5 8.30771 33.5 18Z'
          stroke='#FAFAFA'
        />
      </svg>
    </div>
  );
}
