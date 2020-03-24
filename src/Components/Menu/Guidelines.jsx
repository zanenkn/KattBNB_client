import React from 'react'
import Spinner from '../ReusableComponents/Spinner'
import { useTranslation, Trans } from 'react-i18next'
import { Header, Segment, Label } from 'semantic-ui-react'

const Guidelines = () => {
  const { t, ready } = useTranslation('Guidelines')
  if (ready) {
    return (
      <div className='content-wrapper' >
        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Guidelines:before-stay.title')}
        </Header>
        <p>
          {t('Guidelines:before-stay.p1')}
        </p>
        <ul>
          <li>
            {t('Guidelines:before-stay.list-item1')}
          </li>
          <li>
            {t('Guidelines:before-stay.list-item2')}
          </li>
          <li>
            {t('Guidelines:before-stay.list-item3')}
          </li>
          <li>
            {t('Guidelines:before-stay.list-item4')}
          </li>
        </ul>
        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Guidelines:owner.title')}
        </Header>
        <ul>
          <li>
            {t('Guidelines:owner.list-item1')}
          </li>
          <li>
            {t('Guidelines:owner.list-item2')}
          </li>
          <li>
            {t('Guidelines:owner.list-item3')}
          </li>
          <li>
            {t('Guidelines:owner.list-item4')}
          </li>
        </ul>
        <Segment raised style={{ 'paddingTop': '1rem', 'margin': '1rem 0' }}>
          <Label ribbon style={{ 'backgroundColor': '#c90c61', 'color': 'white', 'margin': '0 0 1rem' }}>
            {t('Guidelines:owner.checklist.title')}
          </Label>
          <p style={{ 'padding': '0 1rem 1rem 1rem', 'textSize': 'small' }}>
            <ul>
              <li>
                {t('Guidelines:owner.checklist.list-item1')}
              </li>
              <li>
                {t('Guidelines:owner.checklist.list-item2')}
              </li>
              <li>
                {t('Guidelines:owner.checklist.list-item3')}
              </li>
              <li>
                {t('Guidelines:owner.checklist.list-item4')}
              </li>
              <li>
                {t('Guidelines:owner.checklist.list-item5')}
              </li>
            </ul>
            <p style={{'fontStyle': 'italic', 'margin': '1rem 0 0.5rem'}}>
              {t('Guidelines:owner.optional.title')}
            </p>
            <ul>
              <li>
                {t('Guidelines:owner.optional.list-item1')}
              </li>
              <li>
                {t('Guidelines:owner.optional.list-item2')}
              </li>
            </ul>
          </p>
        </Segment>
        <Header as='h3' style={{ 'textAlign': 'left' }} >
          {t('Guidelines:host.title')}
        </Header>
        <ul>
          <li>
            {t('Guidelines:host.list-item1')}
          </li>
          <li>
            {t('Guidelines:host.list-item2')}
          </li>
          <li>
            {t('Guidelines:host.list-item3')}
          </li>
          <li>
            {t('Guidelines:host.list-item4')}
          </li>
          <li>
            {t('Guidelines:host.list-item5')}
          </li>
          <li>
            {t('Guidelines:host.list-item6')}
          </li>
          <li>
            {t('Guidelines:host.list-item7')}
          </li>
          <li>
            {t('Guidelines:host.list-item8')}
          </li>
          <li>
            {t('Guidelines:host.list-item9')}
          </li>
        </ul>
      </div>
    )
  } else {
    return (<Spinner />)
  }
}

export default Guidelines