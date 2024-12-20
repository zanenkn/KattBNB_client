import styled, { keyframes } from 'styled-components';
import { theme } from '../../Styles/theme';
import { Container, Divider, Text } from '../../UI-Components';

const { spacing, colors } = theme;

export const FlexWrapper = styled(Container)`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${({ centered }) => centered && 'justify-content: center'};

  > * {
    margin-bottom: 0;
    margin-right: ${({ spaceBetween }) => spacing[spaceBetween]};
  }

  > *:last-child {
    margin-right: 0;
  }
`;

export const StyledUpdateFormWrapper = styled.div`
  max-height: ${({ open }) => (open ? '1000px' : '0px')};
  height: auto;
  overflow: hidden;
  transition: max-height 1s ease-in-out;
  padding: 0 2px;
`;

export const UpdateFormWrapper = ({ open, children, ...rest }) => {
  return (
    <StyledUpdateFormWrapper open={open} {...rest}>
      {open && (
        <>
          <Divider bottom={5} />
          {children}
          <Divider bottom={6} />
        </>
      )}
    </StyledUpdateFormWrapper>
  );
};

export const DescriptionWrapper = styled(Text)`
  > *:first-child {
    margin-right: ${spacing[2]};
  }
  > *:last-child {
    margin-left: ${spacing[2]};
  }
`;

// PROGRESS BAR //

export const ProgressBarWrapper = styled(Container)`
  background: ${colors.neutral[10]};
  padding: 1rem;
  margin-right: auto;
  margin-left: auto;
  max-width: 300px;
  > *:last-child {
    margin-bottom: 0;
  }
`;

export const CtaWrapper = styled(Container)`
  max-width: 560px;
  margin-right: auto;
  margin-left: auto;
`;

export const Explained = styled(Container)`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  > * {
    margin-bottom: 0;
  }
`;

export const StepExplanation = styled(Text)`
  width: 74px;
`;

const fillChange = keyframes`
  from {fill: ${colors.neutral[20]};}
  to {fill: ${colors.success[100]};}
`;

const colorChange = keyframes`
  from {background-color: ${colors.neutral[20]};}
  to {background-color: ${colors.success[100]};}
`;

const progress = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

export const StepIcon = styled.div`
  width: 74px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  & > svg {
    fill: ${colors.neutral[20]};
    animation-name: ${({ active }) => (active ? fillChange : 'none')};
    animation-duration: 0.2s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }
`;

export const ProggressBarLine = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  height: 4px;
  background: ${colors.neutral[20]};
`;

export const ProgressStepWrapper = styled.div`
  display: flex;
  position: relative;
  width: calc(100% - 54px);
  margin: auto auto 1.5rem;
`;

export const ProgressBarSteps = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  z-index: 2;
`;

export const ProgressBarStep = styled.div`
  font-size: smaller;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  background: ${colors.neutral[20]};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  animation-name: ${({ active }) => (active ? colorChange : 'none')};
  animation-duration: 0.2s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
`;

export const InnerLine = styled.div`
  width: 0;
  animation: ${progress} 1s linear forwards;
  background: ${colors.success[100]};
  height: 100%;
  max-width: ${({ width }) => width};
`;
