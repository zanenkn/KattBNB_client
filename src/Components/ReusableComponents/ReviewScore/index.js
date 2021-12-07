import React from 'react';
import HalfPaw from './halfPaw';
import Paw from './paw';
import { theme } from '../../../Styles/theme';
import { FlexWrapper } from './styles';
import { Text } from '../../../UI-Components';
import PropTypes from 'prop-types';

const { colors, spacing } = theme;

const ReviewScore = ({
  margin,
  center,
  clickable,
  score,
  setScore,
  height,
  displayNumerical,
  primaryColor,
  secondaryColor,
}) => {
  let points = [1, 2, 3, 4, 5];
  return (
    <FlexWrapper horizontalAlign={center ? 'center' : 'left'} margin={margin} clickable={clickable}>
      {points.map((sc) => {
        if (score % 1 !== 0 && Math.floor(score) + 1 === sc) {
          return (
            <div onClick={setScore} key={sc} id={sc}>
              <HalfPaw
                primary={colors[primaryColor][100]}
                secondary={colors[secondaryColor][40]}
                height={spacing[height]}
              />
            </div>
          );
        } else {
          return (
            <div onClick={setScore} key={sc} id={sc}>
              <Paw
                fill={Math.floor(score) >= sc ? colors[primaryColor][100] : colors[secondaryColor][40]}
                height={spacing[height]}
              />
            </div>
          );
        }
      })}
      {displayNumerical && <Text>({score % 1 !== 0 ? parseFloat(score).toFixed(1) : score}/5)</Text>}
    </FlexWrapper>
  );
};

ReviewScore.defaultProps = {
  margin: '1rem 0',
  center: false,
  clickable: false,
  height: 6,
  displayNumerical: false,
  primaryColor: 'primary',
  secondaryColor: 'neutral',
};

ReviewScore.propTypes = {
  margin: PropTypes.oneOf(Object.keys(spacing)),
  center: PropTypes.bool,
  clickable: PropTypes.bool,
  score: PropTypes.number,
  setScore: PropTypes.func,
  height: PropTypes.oneOf(Object.keys(spacing)),
  displayNumerical: PropTypes.bool,
  primaryColor: PropTypes.oneOf(Object.keys(colors)),
  secondaryColor: PropTypes.oneOf(Object.keys(colors)),
};

export default ReviewScore;
