import { Switch } from '@headlessui/react';
import AnimatedLoader from 'components/AnimatedLoader';
import Layout from 'components/layout';
import { Formik } from 'formik';
import { bannerFlatten, bannerReslover, bannerTypes, clsx } from 'lib/constants';
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

  const bannerData = bannerReslover(settings.banner);

  return (
    <Layout title={`${user.username} - Settings`}>
      <Formik
        initialValues={{ description: settings.description, active: settings.active, bannerData }}
        validate={() => {
          const errors: any = {};

          return errors;
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          const ValidValues: any = Object.fromEntries(Object.entries(values).filter(([key, value]) => value !== settings[key] && key !== 'bannerData'));
          const bannerflat = bannerFlatten(values.bannerData ?? { type: 'unknown', image: null, color: null });

          const body = Object.assign(ValidValues, { ...(settings.banner === bannerflat ? {} : { banner: bannerflat }) });

          const data = await fetch(`${window.origin}/api/auth/updates`, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
              authorization: `${settings._id}=+${settings.updates_access}`,
            },
          }).then(d => d.json());

          if (!data.success) return;

          const updateObjectMapping = Object.fromEntries(Object.entries(data.message).filter(([key]) => ValidValues[key]));

          /**
           * NOTE: settings value is reset / destructuerd as to update the new date
           * and not interfere with the values check. settings is destructuerd because "updates" patch doesn't
           * return the users profile "update_access" token so the token will be destructuerd back into settings data.
           */
          // eslint-disable-next-line no-param-reassign
          settings = { ...settings, ...data.message };
          resetForm({ values: { ...values, ...updateObjectMapping } });

          setSubmitting(false);
        }}
      >
        {({ handleSubmit, handleChange, handleBlur, values, isSubmitting, setValues, dirty, resetForm }) => (
          <>
            <span>
              <div
                className={clsx(
                  'transition duration-500 ease-in-out transform absolute -bottom-16 left-0 w-full min-w-max sm:w-4/12 p-3 overflow-y-hidden',
                  dirty ? 'translate-y-0 opacity-1' : '-translate-y-6 opacity-0 pointer-events-none'
                )}
              >
                <div className='flex bg-popupcard rounded p-2 justify-between space-x-2'>
                  <span className='inline-flex flex-wrap content-center'>Change detected!</span>
                  <div className='flex space-x-2'>
                    <button className='px-2 py-1 bg-blue-800 rounded focus:outline-none' type='button' onClick={() => resetForm()}>
                      Cancel
                    </button>
                    <button className='px-2 py-1 bg-blue-800 rounded focus:outline-none space-x-2' type='submit' disabled={isSubmitting} onClick={() => handleSubmit()}>
                      {isSubmitting && <span title='Saving data...' className='relative inline-flex rounded-full h-3 w-3 bg-red-500' />}
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </span>

            <form>
              <div className='flex flex-wrap flex-col sm:content-center space-y-2 overflow-x-hidden'>
                <label>Description</label>
                <MiniEditor {...{ handleBlur, handleChange, value: values.description }} />

                <div className='flex flex-wrap justify-center space-x-3'>
                  <label>Active</label>
                  <div>
                    <Switch
                      checked={values.active}
                      onChange={active => setValues({ ...values, active })}
                      className={`transition duration-300 ease-in-out transform  ${
                        values.active ? 'bg-blue-600' : 'bg-gray-300'
                      } relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none`}
                    >
                      <span className='sr-only'>Active</span>
                      <span
                        className={`transition duration-300 ease-in-out transform  ${
                          values.active ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full`}
                      />
                    </Switch>
                  </div>
                </div>

                <label>Banner ({values.bannerData.type})</label>
                <select
                  name='banner type'
                  id='banner_type'
                  className='text-gray-700 rounded focus:outline-none'
                  onChange={e => setValues({ ...values, bannerData: { ...values.bannerData, type: e.currentTarget.value as bannerTypes } })}
                  value={values.bannerData.type}
                >
                  <option value='color'>Solid color background</option>
                  <option value='img'>Url background image (test)</option>
                </select>

                <div className='pt-3'>
                  {values.bannerData.type === 'color' && <div>Color picker</div>}
                  {values.bannerData.type === 'img' && (
                    <div>
                      <input
                        type='text'
                        placeholder='Image url'
                        value={values.bannerData.image}
                        className='rounded px-2 py-1 focus:outline-none text-black'
                        onChange={e => setValues({ ...values, bannerData: { ...values.bannerData, image: e.currentTarget.value } })}
                      />
                    </div>
                  )}
                </div>
              </div>
            </form>
          </>
        )}
      </Formik>
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
