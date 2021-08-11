import Footer from 'components/footer';
import MetaTags from 'components/MetaTags';
import React from 'react';

export default function TOS() {
  return (
    <>
      <MetaTags title='Dmod - Terms of Service' description='Site Terms of Service'>
      <div className='text-center space-y-7 mt-7'>
        <div>
          <h1 className='font-bold text-3xl sm:text-5xl'>Discord Moderation Terms of Service</h1>
          <small>(dmod.gg)</small>
        </div>

        <div className='term'>
          <h2>Terms:</h2>
          <div className='terms-text'>
            <p>
              By accessing our website (dmod.gg), you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible
              for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials
              contained in this website are protected by applicable copyright and trademark law. dmod.gg is NOT affiliated with Discord or any other services.
            </p>
          </div>
        </div>

        <div className='term'>
          <div>
            <h2>Conditions of Use:</h2>
            <div className='terms-text'>
              <p>
                We will provide our services to you, which are subject to the conditions stated below in this document. Every time you visit this website, use its services or make
                a purchase, you accept the following conditions. This is why we urge you to read them carefully.
              </p>
            </div>
          </div>

          <div className='term'>
            <h2>Privacy Policy:</h2>
            <div className='terms-text'>
              <p>
                Before you continue using our website we advise you to read our privacy policy [link to privacy policy] regarding our user data collection. It will help you better
                understand our practices.
              </p>
            </div>
          </div>

          <div className='term'>
            <h2>Copyright:</h2>
            <div className='terms-text'>
              <p>
                Content published on this website (digital downloads, images, texts, graphics, logos) is the property of dmod.gg and/or its content creators and protected by
                international copyright laws. The entire compilation of the content found on this website is the exclusive property of dmod.gg, with copyright authorship for this
                compilation by dmod.gg.
              </p>
            </div>
          </div>

          <div className='term'>
            <h2>Applicable Law:</h2>
            <div className='terms-text'>
              <p>
                By visiting this website, you agree that the laws of Connecticut, without regard to principles of conflict laws, will govern these terms of service, or any dispute
                of any sort that might come between dmod.gg and you, or its business partners and associates. You also agree that the laws of your country/juridstriction will
                govern these terms of service.
              </p>
            </div>
          </div>

          <div className='term'>
            <h2>Disputes:</h2>
            <div className='terms-text'>
              <p>
                Any dispute related in any way to your visit to this website or to products you purchase from us shall be arbitrated by state or federal court in Connecticut and
                you consent to exclusive jurisdiction and venue of such courts.
              </p>
            </div>
          </div>

          <div className='term'>
            <h2>Comments, Reviews, and Emails:</h2>
            <div className='terms-text'>
              <p>
                Visitors may post content as long as it is not obscene, illegal, defamatory, threatening, infringing of intellectual property rights, invasive of privacy or
                injurious in any other way to third parties. Content has to be free of software viruses, political campaign, and commercial solicitation.
                <br />
                We reserve all rights (but not the obligation) to remove and/or edit such content. When you post your content, you grant dmod.gg non-exclusive, royalty-free and
                irrevocable right to use, reproduce, publish, modify such content throughout the world in any media.
              </p>
            </div>
          </div>

          <div className='term'>
            <h2>License and Site Access:</h2>
            <div className='terms-text'>
              <p>
                We grant you a limited license to access and make personal use of this website. You are not allowed to download or modify it. This may be done only with written
                consent from us.
              </p>
            </div>
          </div>

          <div className='term'>
            <h2>User Accounts:</h2>
            <div className='terms-text'>
              <p>
                If you are an owner of an account on this website, you are solely responsible for maintaining the confidentiality of your private user details (username and
                password). You are responsible for all activities that occur under your account or password.
              </p>
            </div>
          </div>
          <div className='pt-10 text-lg'>
            <b>We reserve all rights to terminate accounts, edit or remove content and cancel orders in their sole discretion.</b>
          </div>
        </div>
      </div>
      <div className='my-10 text-center'>
        <small>Last Updated: 12/24/2020</small>
      </div>
      <Footer />
    </>
  );
}
