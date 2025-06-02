import React from 'react';
import PropTypes from 'prop-types';

/**
 * Enhanced Grid component with mobile-first responsive features
 */
export const Grid = ({
  children,
  cols = {
    xs: 1,
    sm: 2,
    lg: 3
  },
  gap = 'default',
  align = 'start',
  justify = 'start',
  flow = 'row',
  padding = 'default',
  masonry = false,
  className = '',
  ...props
}) => {
  // Enhanced responsive classes generation
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

  // Enhanced gap sizes with directional options
  const gapSizes = {
    none: 'gap-0',
    xs: 'gap-1 sm:gap-2',
    small: 'gap-2 sm:gap-3',
    default: 'gap-4 sm:gap-6',
    large: 'gap-6 sm:gap-8',
    xl: 'gap-8 sm:gap-10',
  };

  // Enhanced padding sizes
  const paddingSizes = {
    none: 'p-0',
    small: 'p-2 sm:p-3',
    default: 'p-4 sm:p-6',
    large: 'p-6 sm:p-8',
  };

  // Grid alignment utilities
  const alignments = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifyContent = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  // Generate class names
  const gapClass = typeof gap === 'string' ? gapSizes[gap] : `gap-${gap}`;
  const paddingClass = paddingSizes[padding] || '';
  const alignClass = alignments[align] || '';
  const justifyClass = justifyContent[justify] || '';
  const flowClass = flow === 'dense' ? 'grid-flow-dense' : '';
  
  return (
    <div
      className={`
        grid
        ${getColsClasses()}
        ${gapClass}
        ${paddingClass}
        ${alignClass}
        ${justifyClass}
        ${flowClass}
        ${masonry ? 'sm:masonry-cols' : ''}
        ${className}
      `}
      style={masonry ? {
        columnCount: cols.sm || 2,
        columnGap: '1.5rem',
        '@media (min-width: 1024px)': {
          columnCount: cols.lg || 3,
        },
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

// Export a memoized version to prevent unnecessary re-renders
export default React.memo(Grid);

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
      '2xl': PropTypes.number,
    }),
  ]),
  gap: PropTypes.oneOfType([
    PropTypes.oneOf(['none', 'xs', 'small', 'default', 'large', 'xl']),
    PropTypes.number,
  ]),
  align: PropTypes.oneOf(['start', 'center', 'end', 'stretch', 'baseline']),
  justify: PropTypes.oneOf(['start', 'center', 'end', 'between', 'around', 'evenly']),
  flow: PropTypes.oneOf(['row', 'dense']),
  padding: PropTypes.oneOf(['none', 'small', 'default', 'large']),
  masonry: PropTypes.bool,
  className: PropTypes.string,
};

Grid.defaultProps = {
  cols: {
    xs: 1,
    sm: 2,
    lg: 3
  },
  gap: 'default',
  align: 'start',
  justify: 'start',
  flow: 'row',
  padding: 'default',
  masonry: false,
  className: '',
};

