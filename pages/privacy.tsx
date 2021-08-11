import Footer from 'components/footer';
import MetaTags from 'components/MetaTags';
import React from 'react';

export default function Privacy() {
  return (
    <>
      <MetaTags title='Dmod - Privacy Policy' description='Site Privacy Policy' />
      <div style={{ minHeight: '81.5vh' }}>
        <h1 className='text-center mt-3 mb-6 text-5xl'>Privacy Policy</h1>
        <div className='flex justify-center text-center'>
          <div className='w-3/4 sm:w-3/5 space-y-3'>
            <p>At dmod.gg, your privacy is immensly important to us.</p>
            <p>
              Your personal information is only collected when it’s absolutely necessary to provide our services to you. We collect it by fair and lawful means, with your knowledge
              and consent.
            </p>
            <p>
              We only retain collected information for as long as necessary to provide you with your requested service (such as user IDs and Discord Usernames). What data we store,
              we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorised access, disclosure, copying, use or modification.
            </p>
            <p>We will never sell, rent, or share any personally identifying information publicly or with third-parties, except when required to by law.</p>
            <p>You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.</p>
            <p>
              Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot
              accept responsibility or liability for their respective privacy policies.
            </p>
            <p>
              Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we
              handle user data and personal information, feel free to contact us.
            </p>
          </div>
        </div>
        <div className='my-4 text-center'>
          <small>Last Updated: 12/24/2020</small>
        </div>
      </div>
      <Footer />
    </>
  );
}
