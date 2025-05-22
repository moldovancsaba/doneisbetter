import React from 'react';
import PropTypes from 'prop-types';

export const Grid = ({
  children,
  cols = {
    xs: 1,
    sm: 2,
    lg: 3
  },
  gap = 'default',
  className = '',
  ...props
}) => {
  // Convert cols object to responsive class names
  const getColsClasses = () => {
    if (typeof cols === 'object') {
      return Object.entries(cols).map(([breakpoint, value]) => {
        if (breakpoint === 'xs') {
          return `grid-cols-${value}`;
        }
        return `${breakpoint}:grid-cols-${value}`;
      }).join(' ');
    }
    
    return `grid-cols-${cols}`;
  };
  
  const gapSizes = {
    small: 'gap-2 sm:gap-3',
    default: 'gap-4 sm:gap-6',
    large: 'gap-6 sm:gap-8',
  };
  
  const gapClass = typeof gap === 'string' ? gapSizes[gap] : `gap-${gap}`;
  
  return (
    <div
      className={`grid ${getColsClasses()} ${gapClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Grid.propTypes = {
  children: PropTypes.node.isRequired,
  cols: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      xs: PropTypes.number,
      sm: PropTypes.number,
      md: PropTypes.number,
      lg: PropTypes.number,
      xl: PropTypes.number,
    }),
  ]),
  gap: PropTypes.oneOfType([
    PropTypes.oneOf(['small', 'default', 'large']),
    PropTypes.number,
  ]),
  className: PropTypes.string,
};

