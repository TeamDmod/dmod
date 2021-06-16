import { Switch } from '@headlessui/react';
import AnimatedLoader from 'components/AnimatedLoader';
import Layout from 'components/layout';
import { Formik } from 'formik';
import { clsx } from 'lib/constants';
import connectToDatabase from 'lib/mongodb.connection';
import withSession from 'lib/session';
import useUserGard from 'lib/useUserGard';
import userModule, { userData } from 'models/users';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import React from 'react';
import { ApiUser, withSessionGetServerSideProps } from 'typings/typings';

interface MiniEditorProps {
  value: string;
  handleBlur: any;
  handleChange: any;
}

function MiniEditor({ value, handleBlur, handleChange }: MiniEditorProps) {
  return (
    <textarea
      className='bg-popupcard text-gray-100 px-2 py-1 focus:outline-none rounded resize-none'
      id='description'
      cols={40}
      rows={10}
      value={value}
      onBlur={handleBlur}
      onChange={handleChange}
      spellCheck={false}
    />
  );
}

interface props {
  user: ApiUser;
  settings: userData;
}

export default function Settings({ user, settings }: props) {
  const { loading } = useUserGard(user);

  if (loading)
    return (
      <Layout title='Loading...'>
        <AnimatedLoader />
      </Layout>
    );

  return (
    <Layout title={`${user.username} - Settings`}>
      <div>
        <Formik
          initialValues={{ description: settings.description, active: settings.active, bannerData: { type: 'unknown' } }}
          validate={() => {
            const errors: any = {};

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            const endValues: any = Object.fromEntries(Object.entries(values).filter(([key, value]) => value !== settings[key]));
            setTimeout(() => {
              // alert(JSON.stringify(endValues, null, 2));
              console.log(endValues);

              setSubmitting(false);
            }, 400);
          }}
        >
          {({ handleSubmit, handleChange, handleBlur, values, isSubmitting, setValues, dirty, resetForm }) => (
            <form onSubmit={handleSubmit}>
              <div className='flex flex-wrap flex-col content-center space-y-2 overflow-x-hidden'>
                <label>Description</label>
                <MiniEditor {...{ handleBlur, handleChange, value: values.description }} />

                <label>Active</label>
                <div className='flex flex-wrap justify-center'>
                  <Switch
                    checked={values.active}
                    onChange={active => setValues({ ...values, active })}
                    className={`${values.active ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none`}
                  >
                    <span className='sr-only'>Active</span>
                    <span className={`${values.active ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full`} />
                  </Switch>
                </div>

                <label>Banner ({values.bannerData.type})</label>
                <select
                  name='banner type'
                  id='banner_type'
                  className='text-gray-700 rounded focus:outline-none'
                  onChange={e => setValues({ ...values, bannerData: { ...values.bannerData, type: e.currentTarget.value } })}
                >
                  <option value='solid' selected={values.bannerData.type === 'solid'}>
                    Solid color background
                  </option>
                  <option value='url' selected={values.bannerData.type === 'url'}>
                    Url background image (test)
                  </option>
                </select>
              </div>

              <span>
                <div
                  className={clsx(
                    'transition duration-500 ease-in-out transform absolute -bottom-10 left-0 w-full sm:w-4/12 p-3 overflow-y-hidden',
                    dirty ? 'translate-y-0 opacity-1' : '-translate-y-6 opacity-0 pointer-events-none'
                  )}
                >
                  <div className='flex bg-popupcard rounded p-2 justify-between'>
                    <span className='inline-flex flex-wrap content-center'>Change detected!</span>
                    <div className='flex space-x-2'>
                      <button
                        className='px-2 py-1 bg-blue-800 rounded'
                        type='button'
                        onClick={() => {
                          resetForm();
                        }}
                      >
                        Cancel
                      </button>
                      <button className='px-2 py-1 bg-blue-800 rounded' type='submit' disabled={isSubmitting}>
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </span>
            </form>
          )}
        </Formik>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withSession(
  async (context: withSessionGetServerSideProps): Promise<GetServerSidePropsResult<any>> => {
    await connectToDatabase();
    const session = context.req.session.get('user');

    if (!session)
      return {
        redirect: {
          destination: 'api/auth/login',
          permanent: false,
        },
      };

    const user = await userModule.findOne({ _id: session.id });
    const objectUser = user.toObject();

    return {
      props: {
        settings: objectUser,
      },
    };
  }
);

/**
 * bottom 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55) 0s, background-color 400ms ease-out 0s
 */
