import Layout from 'components/layout';
import home from '../styles/home.module.scss';

export default function Home() {
  return (
    <Layout title={'Welcome to Dmod.gg'} description={'The best place to hire moderators!'} image={'/logo.png'}>
      <div className={home.main_header}>
        <div className={home.text_headings}>
          <h1>Welcome to dmod.</h1>
          <p>Discords most advanced moderator searching application.</p>
        </div>
        <div className={home.search_container}>
          <input placeholder='Search dmod.' className={home.search_bar}></input>
          <button className={home.search_button}>Search.</button>
        </div>
      </div>
      <div className={home.home_main_content}>
        <div className={home.top_rated}>
          <div className={home.heading}>
            <h1>Top rated moderators.</h1>
            <p>Based on user feedback these people are the best!</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
