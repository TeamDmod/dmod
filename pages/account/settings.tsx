import { Switch } from '@headlessui/react';
import AnimatedLoader from 'components/AnimatedLoader';
import Layout from 'components/layout';
import Profile from 'components/profile';
import { Formik } from 'formik';
import { bannerFlatten, bannerResolver, bannerTypes, clsx } from 'lib/constants';
import connectToDatabase from 'lib/mongodb.connection';
import withSession from 'lib/session';
import { validators } from 'lib/userUpdateValidators';
import useUserGard from 'lib/useUserGard';
import userModule, { userData } from 'models/users';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import React, { useEffect, useState } from 'react';
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
      spellCheck
    />
  );
}

interface props {
  user: ApiUser;
  settings: userData;
}

export default function Settings({ user, settings }: props) {
  const { loading } = useUserGard(user);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    function _(evt) {
      const is = document.getElementById('preview_392sf').classList[0].split('pre-')[1];
      const isEscape = evt.key === 'Escape' || evt.key === 'Esc';
      if (is === 'open' && isEscape) setPreviewOpen(false);
    }

    document.addEventListener('keydown', _);

    return () => {
      document.removeEventListener('keydown', _);
    };
  }, []);

  if (loading)
    return (
      <Layout title='Loading...'>
        <AnimatedLoader />
      </Layout>
    );

  const bannerData = bannerResolver(settings.banner);

  return (
    <Layout title={`${user.username} - Settings`} description='User settings'>
      <span id='preview_392sf' className={previewOpen ? 'pre-open' : 'pre-close'} />
      <div className='text-center'>
        <button className='bg-green-700 rounded p-1 mb-3 focus:outline-none' onClick={() => setPreviewOpen(!previewOpen)}>
          Preview changes
        </button>
      </div>
      <Formik
        initialValues={{ description: settings.description, active: settings.active, bannerData }}
        validate={values => {
          const errors: any = {};
          const bannerflat = bannerFlatten(values.bannerData ?? { type: 'unknown', image: null, color: null });

          const validatorData = { user_premium: user.premium_type, user: { ...settings, ...values, banner: bannerflat } };
          let err = null;
          Object.entries({ ...values, banner: bannerflat })
            .filter(([k]) => k !== 'bannerData')
            .forEach(([key, value]) => {
              const validation = validators[key] ?? validators.DEFAULT;

              const validated = validation({ value, ...validatorData });
              if (validated.error) err = validated.message;
            });
          setError(err);

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

          if (!data.success) {
            setError(data.message);
            setTimeout(() => setError(null), 3000);
            return;
          }

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
            <div
              className={clsx(
                'transform transition duration-300 ease-in-out fixed z-40 inset-y-0 inset-x-0 h-screen w-full bg-gray-800 bg-opacity-90',
                previewOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0 visible pointer-events-none'
              )}
            >
              <div className='px-10 sm:px-16 pt-5 rounded h-full flex'>
                <div className='p-2 bg-dorpdown w-full h-full overflow-y-auto'>
                  <Profile profile={{ ...settings, ...values, banner: bannerFlatten(values.bannerData ?? { type: 'unknown', image: null, color: null }) }} />
                </div>
                <div className='relative'>
                  <div className='ml-1 focus:outline-none absolute flex flex-col text-center space-y-1'>
                    <span
                      className='border-2 border-gray-200 h-8 w-8 rounded-full hover:bg-gray-300 hover:bg-opacity-30 cursor-pointer'
                      onClick={() => setPreviewOpen(!previewOpen)}
                    />
                    <span className='cursor-default text-sm'>ESC</span>
                  </div>
                </div>
              </div>
            </div>

            <span>
              <div
                className={clsx(
                  'transition duration-500 ease-in-out transform absolute z-0 -bottom-16 left-0 w-full min-w-max sm:w-4/12 p-3 overflow-y-hidden',
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

              <div
                className={clsx(
                  'transition duration-500 ease-in-out transform absolute z-0 sm:-bottom-16 -bottom-24 right-0 w-full min-w-max sm:w-4/12 p-3 overflow-y-hidden',
                  error ? 'translate-y-0 opacity-1' : '-translate-y-6 opacity-0 pointer-events-none'
                )}
              >
                <div className='px-2 py-1 bg-red-600 rounded font-bold'>{error}</div>
              </div>
            </span>

            <form>
              <div className='flex flex-wrap flex-col sm:content-center space-y-2 overflow-x-hidden'>
                <label>Description</label>
                <MiniEditor {...{ handleBlur, handleChange, value: values.description }} />

                <div className='flex flex-wrap justify-center space-x-3'>
                  <label>Active</label>
                  <div className='z-0'>
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
