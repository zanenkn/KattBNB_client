import React from 'react'
import { Sidebar, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'

const Faq = () => {
  const { t, ready } = useTranslation('Faq')
  if (ready) {
    return (
      <Sidebar.Pushable className='content-wrapper' >
        <Header as='h1'>
          {t('reusable:title.faq')}
        </Header>

        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Faq:header1')}
        </Header>

        <p>
          {t('Faq:p1')}
        </p>

        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Faq:header2')}
        </Header>

        <p>
          {t('Faq:p2')}
        </p>

        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Faq:header3')}
        </Header>

        <p>
          <Trans i18nKey='Faq:p3'>
            We are couple of friends passionate about cats and coding. We believe in solving problems that matter and having fun while at it. More <Header as={Link} to='about-us' style={{ 'fontSize': 'medium' }} className='fake-link-underlined-reg'>here</Header>.
          </Trans>
        </p>

        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Faq:header4')}
        </Header>

        <p>
          <Trans i18nKey='Faq:p4-1'>
            Good! If you have an idea how to improve our code, you are welcome to open a pull request <a href='https://github.com/zanenkn/KattBNB_client' target='_blank' rel='noopener noreferrer' style={{ 'textDecoration': 'underline' }}>on GitHub</a>.
          </Trans>
        </p>

        <p>
          <Trans i18nKey='Faq:p4-2'>
            For any other suggestions and feedback, please use <Header as={Link} to='contact-us' className='fake-link-underlined-reg'>this form</Header> to get in touch with us.
          </Trans>
        </p>

      </Sidebar.Pushable>
    )
  } else { return <Spinner /> }
}

export default Faq
