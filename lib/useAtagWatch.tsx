import LinkChecker from 'components/guild/LinkChecker';
import { useEffect } from 'react';

export default function useAtagWatch(watch: string) {
  const valid = /^https:\/\/[^ ]{1,}/;
  useEffect(() => {
    const lig = [];

    document.querySelectorAll('a[role="button"][data-linking="true"][data-to]').forEach(elm => {
      // @ts-expect-error
      if (!valid.test(elm?.dataset.to)) return;
      const nvm = () => {
        // @ts-expect-error
        LinkChecker.create(elm?.dataset.to);
      };
      lig.push({ elm, nvm });
      elm.addEventListener('click', nvm);
    });

    return () => {
      LinkChecker.destroy();
      lig.forEach(({ elm, nvm }) => {
        elm.removeEventListener('click', nvm);
      });
    };
    // window.addEventListener('scroll', toggleVisible);
  }, [watch]);
}
