import { homedir } from 'os';
import HomeHeader from '../components/headers/HomeHeader';
import home from '../styles/home.module.scss';

export default function Home() {
  return (
    <div>
      <HomeHeader></HomeHeader>
      <div className={home.home_main_content}>
        <div className={home.top_rated}>
          <div className={home.heading}>
            <h1>Top rated moderators.</h1>
            <p>Based on user feedback these people are the best!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
