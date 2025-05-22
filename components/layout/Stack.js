import React from 'react';
import PropTypes from 'prop-types';

export const Stack = ({
  children,
  direction = 'vertical',
  spacing = 'default',
  align = 'stretch',
  justify = 'start',
  className = '',
  ...props
}) => {
  const baseStyles = 'flex';
  
  const directions = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
    'responsive': 'flex-col sm:flex-row',
  };
  
  const spacings = {
    none: 'gap-0',
    small: 'gap-2',
    default: 'gap-4',
    large: 'gap-6',
    responsive: 'gap-3 sm:gap-4 lg:gap-6',
  };
  
  const alignments = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };
  
  const justifications = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  return (
    <div
      className={`
        ${baseStyles}
        ${directions[direction]}
        ${spacings[spacing]}
        ${alignments[align]}
        ${justifications[justify]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

Stack.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['vertical', 'horizontal', 'responsive']),
  spacing: PropTypes.oneOf(['none', 'small', 'default', 'large', 'responsive']),
  align: PropTypes.oneOf(['start', 'center', 'end', 'stretch']),
  justify: PropTypes.oneOf(['start', 'center', 'end', 'between', 'around', 'evenly']),
  className: PropTypes.string,
};

