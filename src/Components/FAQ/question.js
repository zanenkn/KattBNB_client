import { useCallback } from 'react';
import { Container, Text, Header, Flexbox } from '../../UI-Components';
import { RichText } from 'prismic-reactjs';
import { CheveronRight } from '../../icons';
import { IconWrapper, TextWrapper } from './styles.js';

const Question = ({ question, activeIndex, onClick }) => {
  const useReturnQuestionRef = (index) => {
    const ref = useCallback((node) => {
      if (node !== null && activeIndex === index) {
        const nav = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--nav'));
        window.scrollTo({ top: node.getBoundingClientRect().top - nav, behavior: 'smooth' });
      }
    }, []);
    return ref;
  };

  const ref = useReturnQuestionRef(question.data.index);

  return (
    <div ref={ref}>
      <Container>
        <Flexbox verticalAlign={'top'} horizontalAlign={'left'} spaceItemsX={1} onClick={onClick}>
          <IconWrapper active={activeIndex === parseInt(question.data.index)}>
            <CheveronRight height={5} fill='primary' />
          </IconWrapper>
          <Header level={5} index={parseInt(question.data.index)}>
            {question.data.header[0].text}
          </Header>
        </Flexbox>
        {activeIndex === parseInt(question.data.index) && (
          <TextWrapper>
            <Text active={activeIndex === parseInt(question.data.index)}>{RichText.render(question.data.body)}</Text>
          </TextWrapper>
        )}
      </Container>
    </div>
  );
};

export default Question;
