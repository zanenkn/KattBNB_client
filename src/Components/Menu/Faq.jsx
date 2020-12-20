import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Header, Accordion, Icon } from 'semantic-ui-react'
import { useTranslation, Trans } from 'react-i18next'
import Spinner from '../ReusableComponents/Spinner'
import { Helmet } from 'react-helmet'
import queryString from 'query-string'
import Prismic from 'prismic-javascript'
import { RichText } from 'prismic-reactjs'
import { detectLanguage } from '../../Modules/detectLanguage'

const Faq = (props) => {
  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = activeIndex === index ? -1 : index
    setActiveIndex(newIndex)
  }

  const useReturnRef = (key) => {
    const ref = useCallback(node => {
      if (node !== null && queryString.parse(window.location.search).section === key) {
        let nav = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--nav'))
        if (!queryString.parse(window.location.search).active) {
          if (node.children[1].childElementCount > 0) {
            window.scrollTo({ top: node.getBoundingClientRect().top - nav, behavior: 'smooth' })
          }
        } else {
          if (node.children[1].childElementCount > 0) {
            let titles = node.children[1].getElementsByClassName('title')
            let index = parseInt(queryString.parse(window.location.search).active.substring(1)) - 1
            window.scrollTo({ top: titles[index].offsetTop, behavior: 'smooth' })
          }
        }
      }
    }, [questions])
    return ref
  }

  const fetchData = async (tag) => {
    const Client = Prismic.client(process.env.REACT_APP_PRISMIC_REPO)

    const response = await Client.query([
      Prismic.Predicates.at('document.type', 'faq_item'),
      Prismic.Predicates.at('document.tags', [tag])
    ], { orderings: '[my.faq_item.index]', lang: locale })

    setQuestions(old => ({ ...old, [tag]: response.results }))
  }

  const [activeIndex, setActiveIndex] = useState()
  const [questions, setQuestions] = useState({
    general: [],
    sitter: [],
    owner: [],
    privacy: [],
    payments: []
  })

  const locale = detectLanguage().toLowerCase()
  const { t, ready } = useTranslation('Faq')

  const general = useReturnRef('general')
  const sitter = useReturnRef('sitter')
  const owner = useReturnRef('owner')
  const privacy = useReturnRef('privacy')
  const payments = useReturnRef('payments')


  useEffect(() => {
    try {
      fetchData('general')
      fetchData('sitter')
      fetchData('owner')
      fetchData('privacy')
      fetchData('payments')
    } catch (error) {
      console.error(error)
    }

    let query = queryString.parse(props.location.search)
    if (query.active) {
      setActiveIndex(parseInt(query.active))
    }
  }, [locale])

  if (ready) {
    return (
      <>
        <Helmet>
          <title>KattBNB - äntligen ett svar på kattpassningsfrågan</title>
          <meta name='description' content='Fullbokat i kattpensionat? Vi känner igen frustrationen. Vi bryr oss om katterna och därför lanserar KattBNB - allt-i-ett kattpassningssida där du kan hitta en perfekt kattvakt till din katt. Frågor på det?' />
          <link rel='canonical' href='https://kattbnb.se/faq' />
          <meta property='og:title' content='KattBNB - frågor på det?' />
          <meta property='og:url' content='https://kattbnb.se/faq' />
          <meta property='og:type' content='website' />
          <meta property='og:description' content='KattBNB - äntligen ett svar på kattpassningsfrågan' />
          <meta property='og:image' content='https://kattbnb.se/KattBNB_og.jpg' />
        </Helmet>
        <div className='content-wrapper' style={{ 'marginBottom': '2rem', 'paddingBottom': '0' }}>
          <Header as='h1'>
            {t('reusable:title.faq')}
          </Header>
          <p style={{ 'textAlign': 'center' }}>
            <Trans i18nKey='Faq:to-guidelines'>
              Have you booked a stay already? Check out our helpful <Header as={Link} to='guidelines' className='fake-link-underlined-reg'>guidelines</Header>.
            </Trans>
          </p>
        </div>
        <div className='expanding-wrapper'>
          <div ref={general} style={{ paddingTop: '2rem' }}>
            <Header as='h3' style={{ 'textAlign': 'left' }} >
              {t('Faq:general')}
            </Header>
            <Accordion>
              {questions.general.map((question) => {
                return (
                  <>
                    <Accordion.Title
                      active={activeIndex === parseInt(question.data.index)}
                      index={parseInt(question.data.index)}
                      onClick={handleClick}
                      style={{ 'color': 'grey', 'fontWeight': '600' }}
                    >
                      <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
                      {question.data.header[0].text}
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === parseInt(question.data.index)}>
                      {RichText.render(question.data.body)}
                    </Accordion.Content>
                  </>
                )
              })}
            </Accordion>
          </div>
          <div ref={sitter} style={{ paddingTop: '2rem' }}>
            <Header as='h3' style={{ 'textAlign': 'left' }} >
              {t('Faq:sitter')}
            </Header>
            <Accordion>
              {questions.sitter.map((question) => {
                return (
                  <>
                    <Accordion.Title
                      active={activeIndex === parseInt(question.data.index)}
                      index={parseInt(question.data.index)}
                      onClick={handleClick}
                      style={{ 'color': 'grey', 'fontWeight': '600' }}
                    >
                      <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
                      {question.data.header[0].text}
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === parseInt(question.data.index)}>
                      {RichText.render(question.data.body)}
                    </Accordion.Content>
                  </>
                )
              })}
            </Accordion>
          </div>
          <div ref={owner} style={{ paddingTop: '2rem' }}>
            <Header as='h3' style={{ 'textAlign': 'left' }} >
              {t('Faq:owner')}
            </Header>
            <Accordion>
              {questions.owner.map((question) => {
                return (
                  <>
                    <Accordion.Title
                      active={activeIndex === parseInt(question.data.index)}
                      index={parseInt(question.data.index)}
                      onClick={handleClick}
                      style={{ 'color': 'grey', 'fontWeight': '600' }}
                    >
                      <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
                      {question.data.header[0].text}
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === parseInt(question.data.index)}>
                      {RichText.render(question.data.body)}
                    </Accordion.Content>
                  </>
                )
              })}
            </Accordion>
          </div>
          <div ref={privacy} style={{ paddingTop: '2rem' }}>
            <Header as='h3' style={{ 'textAlign': 'left' }} >
              {t('Faq:privacy')}
            </Header>
            <Accordion>
              {questions.privacy.map((question) => {
                return (
                  <>
                    <Accordion.Title
                      active={activeIndex === parseInt(question.data.index)}
                      index={parseInt(question.data.index)}
                      onClick={handleClick}
                      style={{ 'color': 'grey', 'fontWeight': '600' }}
                    >
                      <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
                      {question.data.header[0].text}
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === parseInt(question.data.index)}>
                      {RichText.render(question.data.body)}
                    </Accordion.Content>
                  </>
                )
              })}
            </Accordion>
          </div>
          <div ref={payments} style={{ paddingTop: '2rem' }}>
            <Header as='h3' style={{ 'textAlign': 'left' }} >
              {t('Faq:payments')}
            </Header>
            <Accordion>
              {questions.payments.map((question) => {
                return (
                  <>
                    <Accordion.Title
                      active={activeIndex === parseInt(question.data.index)}
                      index={parseInt(question.data.index)}
                      onClick={handleClick}
                      style={{ 'color': 'grey', 'fontWeight': '600' }}
                    >
                      <Icon name='dropdown' style={{ 'color': '#c90c61' }} />
                      {question.data.header[0].text}
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === parseInt(question.data.index)}>
                      {RichText.render(question.data.body)}
                    </Accordion.Content>
                  </>
                )
              })}
            </Accordion>
          </div>
        </div>
      </>
    )
  } else { return <Spinner /> }
}

export default Faq
