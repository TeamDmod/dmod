import { Dialog, Switch } from '@headlessui/react';
import AnimatedLoader from 'components/AnimatedLoader';
import MetaTags from 'components/MetaTags';
import Editor from 'components/ui/Editor';
import InfoPopUp from 'components/ui/info';
import Profile from 'components/user/profile';
import { Formik } from 'formik';
import { bannerFlatten, bannerResolver, bannerTypes, clsx } from 'lib/constants';
import MarkDown from 'lib/markdown';
import connectToDatabase from 'lib/mongodb.connection';
import withSession from 'lib/session';
import useUserGard from 'lib/useUserGard';
import { DESCRIPTION_MAX_DATA, DESCRIPTION_MIN, validators } from 'lib/validators/userUpdateValidators';
import userModule, { userData } from 'models/users';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import React, { useState } from 'react';
import styles from 'styles/settings.module.scss';
import { ApiUser, withSessionGetServerSideProps } from 'typings/typings';

function XIcon() {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
        d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
      />
    </svg>
  );
}

interface props {
  user: ApiUser;
  settings: userData;
  __setUser: (d: any) => void;
}

export default function Settings({ user, settings: _settings, __setUser }: props) {
  const { loading } = useUserGard(user);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [settings, setSettings] = useState(_settings);

  function validate(values) {
    const errors: any = {};
    const bannerflat = bannerFlatten(values.bannerData ?? { type: 'unknown', image: null, color: null });

    const validatorData = {
      user_premium: user.premium_type,
      user: { ...settings, ...values, banner: bannerflat },
    };
    let err = null;
    Object.entries({ ...values, banner: bannerflat })
      .filter(([k]) => k !== 'bannerData' && k !== 'vanity')
      .forEach(async ([key, value]) => {
        const validation = validators[key] ?? validators.DEFAULT;

        const validated = await validation({ value, ...validatorData });
        if (validated.error) err = validated.message;
      });
    setError(err);

    return errors;
  }

  async function submitForm(values, { setSubmitting, resetForm }) {
    setSubmitting(true);
    const ValidValues: any = Object.fromEntries(
      Object.entries(values).filter(([key, value]) => value !== settings[key] && key !== 'bannerData')
    );
    const bannerflat = bannerFlatten(values.bannerData ?? { type: 'unknown', image: null, color: null });

    const body = Object.assign(ValidValues, {
      ...(settings.banner === bannerflat ? {} : { banner: bannerflat }),
    });

    let token: string;
    try {
      token = localStorage.getItem('@pup/token');
      // eslint-disable-next-line no-empty
    } catch {}

    const data = await fetch(`${window.origin}/api/auth/updates`, {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: {
        authorization: `${settings._id}=+${token}`,
      },
    }).then(d => d.json());

    if (!data.success) {
      setError(data.message);
      setTimeout(() => setError(null), 3000);
      return;
    }

    const updateObjectMapping = Object.fromEntries(
      Object.entries(data.message).filter(([key]) => ValidValues[key])
    );

    if (Object.prototype.hasOwnProperty.call(updateObjectMapping, 'vanity'))
      __setUser({ ...user, vanity: updateObjectMapping.vanity });

    setSettings({ ...settings, ...data.message });
    resetForm({ values: { ...values, ...updateObjectMapping } });

    setSubmitting(false);
  }

  if (loading)
    return (
      <main>
        <MetaTags title='Loading...' />
        <AnimatedLoader />
      </main>
    );

  const bannerData = bannerResolver(settings.banner);

  return (
    <main>
      <MetaTags title={`${user.username} - Settings`} description='User settings' />
      <Formik
        initialValues={{
          description: settings.description,
          active: settings.active,
          bannerData,
          vanity: settings.vanity,
        }}
        validate={validate}
        onSubmit={submitForm}>
        {({ handleSubmit, handleChange, handleBlur, values, isSubmitting, setValues, dirty, resetForm }) => (
          <>
            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} className={styles.preview}>
              <Profile
                profile={{
                  ...settings,
                  ...values,
                  banner: bannerFlatten(
                    values.bannerData ?? {
                      type: 'unknown',
                      image: null,
                      color: null,
                    }
                  ),
                }}
              />
              <div className={styles.preview_button}>
                <button onClick={() => setPreviewOpen(false)}>
                  <XIcon />
                </button>
                <p>ESC</p>
              </div>
            </Dialog>

            <form className={styles.form}>
              <button type='button' onClick={() => setPreviewOpen(true)} className={styles.button}>
                Preview changes
              </button>
              <div className={clsx(styles.description, styles.container)}>
                <label className={styles.info_label}>
                  <span>Description</span>
                  <small>(markdown and html support)</small>
                  <InfoPopUp
                    title='Description info'
                    content={`You can use markdown and html. Though to avoid xss attacks you have a limited range of tags to use;<br/>
                    <span class="tags-list-htg">${MarkDown.getTagsList().join(', ')}</span><br/>
                    Tag attributes are limited allowing *only* the "style"s attribute for all tags, The "a" tag is allowed the "href" attribute for "https" links.
                    The style attributes currently allowed; <span class="tags-list-htg">color, font-size, border-radius, background-color, text-align</span><br/>
                    Allowed measurements; <span class="tags-list-htg">pixel(px), emphemeral unit(em), present(%), root emphemeral unit(rem)</span>
                    <br/><br/>
                    If you'd like to use <a href="https://www.markdownguide.org/basic-syntax/" target="markdownguide">markdown</a>
                    the fetures are only limited by the tags listed above and the markdown parser. Note: "![bar](foo)" will be escaped.
                    <br/><br/>
                    <small>None-https links are ignored when clicked.</small><br/>
                    <small class="res-added">Keep in mind this info was recently and something may have been missed or miss-informed. Thing may also change and/or not updated in time.</small>
                    `}
                  />
                </label>

                <Editor
                  min={DESCRIPTION_MIN}
                  max={DESCRIPTION_MAX_DATA.NORMAL}
                  {...{ handleBlur, handleChange, value: values.description }}
                />
              </div>

              <div className={styles.toggle_label}>
                <label>Active</label>
                <Switch
                  checked={values.active}
                  onChange={active => setValues({ ...values, active })}
                  className={styles.switch}>
                  <span className={clsx(styles.toggle, values.active ? '' : styles.active)} />
                </Switch>
              </div>

              <div className={styles.container}>
                <label>Vanity</label>
                <div className={styles.text}>
                  https://dmod.gg/
                  <input
                    value={values.vanity ?? ''}
                    id='vanity'
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <label>Banner ({values.bannerData.type})</label>
              <select
                name='banner type'
                id='banner_type'
                className={styles.select}
                onChange={e =>
                  setValues({
                    ...values,
                    bannerData: {
                      ...values.bannerData,
                      type: e.currentTarget.value as bannerTypes,
                    },
                  })
                }
                value={values.bannerData.type}>
                <option value='color'>Solid color background</option>
                <option value='img'>Url background image (test)</option>
              </select>

              <div>
                {values.bannerData.type === 'color' && <div>Color picker</div>}
                {values.bannerData.type === 'img' && (
                  <div className={styles.text}>
                    <input
                      type='text'
                      placeholder='Image url'
                      value={values.bannerData.image}
                      style={{ width: '100%' }}
                      onChange={e =>
                        setValues({
                          ...values,
                          bannerData: {
                            ...values.bannerData,
                            image: e.currentTarget.value,
                          },
                        })
                      }
                    />
                  </div>
                )}
              </div>
            </form>

            <span className={styles.dialogue}>
              {dirty && (
                <div className={styles.save}>
                  <p>Change detected!</p>
                  <div className={styles.button}>
                    <button type='button' onClick={() => resetForm()}>
                      Cancel
                    </button>
                    <button type='submit' disabled={isSubmitting} onClick={() => handleSubmit()}>
                      {isSubmitting && <span title='Saving data...' className='' />}
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className={styles.error}>
                  <p className='error'>{error}</p>
                </div>
              )}
            </span>
          </>
        )}
      </Formik>
    </main>
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
