import React from 'react';
import { Header, Text, Avatar, Container } from '../../../UI-Components';

const TeamMemberCard = ({ img, link, name, title, text }) => {
  return (
    <Container space={7}>
      <Container>
        <Avatar src={img} />
      </Container>
      <Header level={5} space={0} color='main' centered>
        <a href={link} target='_blank' rel='noopener noreferrer'>
          {name}
        </a>
      </Header>

      <Text centered bold space={2}>
        {title}
      </Text>
      <Text centered>{text}</Text>
    </Container>
  );
};

export default TeamMemberCard;
