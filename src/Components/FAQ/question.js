import { Container, Text, Header, Flexbox } from '../../UI-Components';
import { RichText } from 'prismic-reactjs';
import { CheveronRight } from '../../icons';
import { IconWrapper, TextWrapper } from './styles.js';

const Question = ({ question, activeIndex, onClick }) => {
  return (
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
  );
};

export default Question;
