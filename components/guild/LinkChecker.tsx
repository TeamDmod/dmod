import ReactDOM from 'react-dom';

export default {
  getElement(link: string) {
    return (
      <div className='content-isahf'>
        <div
          className='main-content-sofd'
          id='conetntogsdg'
          onClick={elm => {
            const holder = document.getElementById('conetntogsdg');
            const cancel = document.getElementById('cancelosjf');

            if (elm.target === holder || elm.target === cancel) {
              elm.preventDefault();
              this.destroy();
            }
          }}
        >
          <div className='model-ujt'>
            <div className='top-sfoj'>
              <h3>
                <b>HOLD UP</b>
              </h3>
              <p className='py-4 break-words'>
                This link takes you to <b>{link}</b>. Are you sure you want to go there?
              </p>
            </div>
            <div className='bt-15j space-x-4'>
              <button id='cancelosjf'>Cancel</button>
              <button
                className='goto-sf my-2'
                onClick={() => {
                  window.open(link);
                  setTimeout(() => this.destroy(), 0);
                }}
              >
                Go to
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
  create(link: string) {
    document.getElementById('__jkicl').classList.add('__jksnv');
    ReactDOM.render(this.getElement(link), document.getElementById('__jkicl'));
  },
  destroy() {
    document.getElementById('__jkicl').classList.remove('__jksnv');
    ReactDOM.unmountComponentAtNode(document.getElementById('__jkicl'));
  },
};
