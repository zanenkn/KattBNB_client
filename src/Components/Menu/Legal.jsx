import React from 'react'
import { Header } from 'semantic-ui-react'
import WIP from '../ReusableComponents/WorkInProgress'
import { useTranslation } from 'react-i18next'

const Legal = () => {
  const { t } = useTranslation()
  return (
    <div className='content-wrapper' >
      <Header as='h1'>
        {t('menu.legal')}
      </Header>
      <WIP />
    </div>
  )
}

export default Legal
