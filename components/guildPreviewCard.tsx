// eslint-disable-next-line import/no-extraneous-dependencies
// import 'tailwindcss/tailwind.css';

import { PreviewGuildData } from 'models/preview_guilds';
import { useRouter } from 'next/router';
import styles from 'styles/preview.module.scss';

interface props {
  duration?: number;
  guild: PreviewGuildData & { banner?: string; icon?: string };
}

export default function GuildPreviewCard({ guild, duration = 0 }: props) {
  const router = useRouter();

  return (
    <div
      className={styles.card}
      style={{
        flexDirection: 'column',
      }}
      onClick={() => router.push(`/servers/${guild._id}`)}>
      <div>
        <div
          style={{
            backgroundImage: `url(${
              guild?.banner ??
              'https://cdn.discordapp.com/banners/791278367960858635/c149d4fa025bcfdd89c38b9fdfc34724.png?size=4096'
            })`,
          }}
          className={styles.banner}
        />
        <div className={styles.icon_container}>
          <div
            style={{
              backgroundImage: `url(${guild?.icon ?? '/logo.png'})`,
            }}
            className={styles.icon}
          />
        </div>
      </div>
      <h3 className='truncate'>{guild.name}</h3>
      <p> {guild.short_description}</p>
    </div>
  );
}
