import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import { RawUserGivenGuild } from 'typings/typings';

interface props {
  closeModal: () => void;
  isOpen: boolean;
  guild: RawUserGivenGuild;
  errorState: [[boolean, string], React.Dispatch<React.SetStateAction<[boolean, string]>>];
}

export default function CreateGuildApplicationModal({ closeModal, isOpen, guild, errorState }: props) {
  const [ErrorData, setErrorData] = errorState;

  if (!guild) return <></>;
  const router = useRouter();

  // function displayError(msg: string) {
  //   setErrorData([true, msg]);
  // }

  if (!isOpen && ErrorData[0]) setErrorData([false, null]);

  // const ErrorData = [false, null];

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='fixed inset-0 z-10 overflow-y-hidden h-screen' onClose={closeModal}>
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0' />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className='inline-block align-middle' aria-hidden='true'>
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div className='inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-popupcard shadow-xl rounded-2xl'>
                <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-200'>
                  {ErrorData[0] ? 'An error occered!' : guild.name}
                </Dialog.Title>

                <div className='mt-2 text-gray-50 text-sm '>
                  {ErrorData[0] ? (
                    <p className='text-red-500'>Error message: {ErrorData[1]}</p>
                  ) : (
                    <>
                      <p>It looks like this guild is not in the database as a listed server applicable.</p>
                      <p>Click create to confirm that you would like to create this guilds application</p>
                    </>
                  )}
                </div>

                <div className='mt-4'>
                  {ErrorData[0] ? (
                    <button
                      type='button'
                      className='inline-flex justify-center px-4 py-2 text-sm font-medium text-purple-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  ) : (
                    <button
                      type='button'
                      className='inline-flex justify-center px-4 py-2 text-sm font-medium text-purple-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500'
                      onClick={() => {
                        router.push(window.location.origin + '/api/auth/invite?id=' + guild.id);
                      }}
                    >
                      Create
                    </button>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
