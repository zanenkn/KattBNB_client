import React from 'react'
import { Sidebar, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Faq = () =>  {
  const { t } = useTranslation()
  return (
    <Sidebar.Pushable className='content-wrapper' >
      <Header as='h1'>
        {t('menu.faq')}
      </Header>
      
      <Header as='h3' style={{'textAlign': 'left'}} >
        {t('faq.header1')}
      </Header>

      <p>
        {t('faq.p1')}
      </p>

      <Header as='h3' style={{'textAlign': 'left'}} >
        {t('faq.header2')}
      </Header>

      <p>
        {t('faq.p2')} 
      </p>

      <Header as='h3' style={{'textAlign': 'left'}} >
        {t('faq.header3')}
      </Header>

      <p>
        We are couple of friends passionate about cats and coding. We believe in solving problems that matter and having fun while at it. More <Header  as={Link} to='about-us' className='fake-link-underlined'>here</Header>. 
      </p>

      <Header as='h3' style={{'textAlign': 'left'}} >
        {t('faq.header4')}
      </Header>

      <p>
        Good! If you have an idea how to improve our code, you are welcome to open a pull request <a href='https://github.com/zanenkn/KattBNB_client' target='_blank' rel='noopener noreferrer' style={{'textDecoration': 'underline'}}>on GitHub</a>. 
      </p>

      <p>
        For any other suggestions and feedback, please use <Header  as={Link} to='contact-us' className='fake-link-underlined'>this form</Header> to get in touch with us. 
      </p>

    </Sidebar.Pushable>
  )
}

export default Faq
