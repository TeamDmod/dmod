import { ApiUser } from 'typings/typings';

import UserDropDown from './userDropDown';

export default function UserLoader({ user, oplm, fetcher }: { user: ApiUser; oplm: () => void; fetcher: any }) {
  return (
    <div>
      <div className='flex flex-wrap content-center flex-row w-full h-full'>
        {user && Object.prototype.hasOwnProperty.call(user, 'awaiting') && (
          <div>
            <div className='animate-pulse flex flex-wrap content-center space-x-3 h-full'>
              <div className='bg-gray-600 rounded-full h-9 sm:h-11 w-9 sm:w-11' />
              {/* <div className='hidden sm:flex flex-wrap content-center'>
                <div className='bg-gray-600 w-20 h-6 rounded'></div>
              </div> */}
            </div>
          </div>
        )}

        {user && !Object.prototype.hasOwnProperty.call(user, 'awaiting') && <UserDropDown fetcher={fetcher} user={user} />}

        {!user && (
          <button className='bg-red-500 px-4 py-2 rounded' onClick={oplm}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}
