import { bannerResolver, evalBadges, evalFlags } from 'lib/constants';
import MarkDown from 'lib/markdown';
import useAtagWatch from 'lib/useAtagWatch';
import React from 'react';
import styles from 'styles/profile.module.scss';

interface props {
  profile: {
    username: string;
    discriminator: string;
    avatar: string;
    bio: string;
    site_flags: number;
  };
}

export default function Profile({ profile }: props) {
  const evaledFlags = evalFlags(profile.site_flags);
  const badges = evalBadges(evaledFlags);

  const bannerData = bannerResolver('');

  useAtagWatch(profile.bio);

  return (
    <main className={styles.container}>
      <div className={styles.inner}>
        {bannerData && (
          <div>
            {bannerData.type === 'img' && (
              <div
                className={styles.banner}
                style={{
                  backgroundImage: `url(${bannerData.image})`,
                }}
              />
            )}
            {bannerData.type === 'color' && (
              <div
                className={styles.banner}
                style={{
                  backgroundColor: bannerData.color,
                }}
              />
            )}
            {bannerData.type === 'unknown' && (
              <div className={styles.banner}>
                <h1>ERROR! Unknow banner type!</h1>
              </div>
            )}
          </div>
        )}
        <img className={styles.pfp} draggable={false} src={profile.avatar} alt='User avatar' />
        <div className={styles.profile}>
          <h2>
            {profile.username}
            <span className={styles.tag}>#{profile.discriminator}</span>
          </h2>

          <div className={styles.badges}>
            {/* Reverse as on pass in of the profile data the order is reversed */}
            {badges.reverse().map(
              ([badge, displayName]) =>
                badge !== null && (
                  <span className={styles.badge_item} key={displayName}>
                    <span className={styles.badge_name}>{displayName}</span>
                    <span>{badge}</span>
                  </span>
                )
            )}
          </div>
          <div className={styles.bio}>
            <h3>🖋 About</h3>
            <div
              className='markdown-content-contaner'
              /* eslint-disable-next-line react/no-danger */
              dangerouslySetInnerHTML={{
                __html: new MarkDown(profile.bio).render(),
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
