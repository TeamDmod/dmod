import { PreviewGuildData } from 'models/preview_guilds';
import { useRouter } from 'next/router';

interface props {
  className?: string;
  duration?: number;
  guild: PreviewGuildData & { banner?: string; icon?: string };
}

export default function GuildPreviewCard({ guild, className = '', duration = 0 }: props) {
  const router = useRouter();

  return (
    <div
      className={`${className} bg-listingcard p-2 rounded cursor-pointer overflow-x-hidden ml-3`}
      style={{
        // @ts-expect-error
        '--duration': `${duration}s`,
        maxWidth: '300px',
        height: '320px',
      }}
      onClick={() => router.push(`/servers/${guild._id}`)}
    >
      <div className='relative'>
        <div
          style={{
            backgroundImage: `url(${guild?.banner ?? 'https://cdn.discordapp.com/banners/791278367960858635/c149d4fa025bcfdd89c38b9fdfc34724.png?size=4096'})`,
            backgroundPosition: 'center center',
            backgroundSize: '110%',
          }}
          className='bg-no-repeat w-full h-24 rounded-t'
        />
        <div className='flex justify-center h-8'>
          <div
            style={{
              boxShadow: '0px 6px 9px rgba(0, 0, 0, 0.25)',
              backgroundImage: `url(${guild?.icon ?? '/logo.png'})`,
              backgroundSize: '100%',
              backgroundPosition: 'center center',
            }}
            className='rounded-full h-20 w-20 absolute top-12 '
          />
        </div>
      </div>
      <h1 className='text-xl truncate text-center'>{guild.name}</h1>
      <div style={{ maxHeight: '200px' }} className='overflow-y-auto'>
        {guild.short_description}
      </div>
    </div>
  );
}
