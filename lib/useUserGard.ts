import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ApiUser } from 'typings/typings';

export default function useUserGard(user?: ApiUser & Object) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push('/');
    if (user && !Object.prototype.hasOwnProperty.call(user, 'awaiting')) setLoading(false);
  }, [user]);

  return { loading, mutateLoading: setLoading };
}
