import { Text, Header } from '../../UI-Components';
import { RichText } from 'prismic-reactjs';

const Question = ({question, activeIndex, onClick}) => {
  return(
    <>
      <Header
        level={5}
        index={parseInt(question.data.index)}
        onClick={onClick}
      >
        {question.data.header[0].text}
      </Header>
      {activeIndex === parseInt(question.data.index) && (
        <Text active={activeIndex === parseInt(question.data.index)}>
          {RichText.render(question.data.body)}
        </Text>
      )}
    </>
  )
}

export default Question;