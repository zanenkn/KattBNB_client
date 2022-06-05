import { useState } from 'react';
import { RequiredLabel } from '../../../UI-Components/Form/TextField';

const withStyling = (Component) => ({label, ...rest}) => {
  const [elementClasses, setElementClasses] = useState(['empty', 'input', 'StripeElement']);

  const handleElementClasses = (className, add) => {
    if (add) {
      setElementClasses((prev) => [...prev, className]);
    } else {
      setElementClasses((prev) => [...prev].filter((el) => el !== className));
    }
  };
  return (
    <div class='mock-field'>
      <div class={`field ${elementClasses.includes('focused') ? 'focused' : ''}`}>
        <Component
          {...rest}
          className={elementClasses.join(' ')}
          onFocus={() => handleElementClasses('focused', true)}
          onBlur={() => handleElementClasses('focused', false)}
          onChange={(el) => handleElementClasses('empty', el.empty)}
        />

        <label>{label}</label>
        <RequiredLabel focused={elementClasses.includes('focused') || !elementClasses.includes('empty')}/>
      </div>
    </div>
  );
};

export default withStyling;
