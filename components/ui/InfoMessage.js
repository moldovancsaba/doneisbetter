import React from 'react';
import Link from 'next/link';
import { Card } from './Card';
import { Button } from './Button';
import { useModuleTheme } from '../../contexts/ModuleThemeContext';

/**
 * @typedef {Object} InfoMessageProps
 * @property {'info' | 'warning' | 'error'} [type='info'] - Message type
 * @property {string} [title] - Optional title
 * @property {string | React.ReactNode} message - Message content
 * @property {boolean} [action=false] - Whether to show action button
 * @property {string} [actionLabel] - Action button text
 * @property {string} [actionLink] - Action button link
 * @property {() => void} [onAction] - Action button click handler
 * @property {string} [module='info'] - Module name for theming
 * @property {string} [className] - Additional CSS classes
 */

/**
 * InfoMessage component displays informational messages with optional actions
 * 
 * @param {InfoMessageProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
const InfoMessage = ({
  type = 'info',
  title,
  message,
  action = false,
  actionLabel,
  actionLink,
  onAction,
  module = 'info',
  className = ''
}) => {
  const { theme: moduleTheme } = useModuleTheme();

  const getTypeConfig = () => {
    switch (type) {
      case 'warning':
        return {
          containerClass: `bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 ${moduleTheme?.borderClass || ''}`,
          textClass: 'text-yellow-800 dark:text-yellow-200',
          buttonClass: `bg-yellow-600 hover:bg-yellow-700 text-white ${moduleTheme?.buttonClass || ''}`,
          icon: '⚠️'
        };
      case 'error':
        return {
          containerClass: `bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 ${moduleTheme?.borderClass || ''}`,
          textClass: 'text-red-800 dark:text-red-200',
          buttonClass: `bg-red-600 hover:bg-red-700 text-white ${moduleTheme?.buttonClass || ''}`,
          icon: '❌'
        };
      default: // info
        return {
          containerClass: `bg-${module}-50 dark:bg-${module}-900/20 border-${module}-200 dark:border-${module}-800 ${moduleTheme?.borderClass || ''}`,
          textClass: `text-${module}-800 dark:text-${module}-200`,
          buttonClass: moduleTheme?.buttonClass || '',
          icon: 'ℹ️'
        };
    }
  };

  const config = getTypeConfig();

  const renderActionButton = () => {
    const buttonProps = {
      variant: "primary",
      className: config.buttonClass,
      onClick: onAction
    };

    return actionLink ? (
      <Link href={actionLink}>
        <Button {...buttonProps}>
          {actionLabel || 'Get Started'}
        </Button>
      </Link>
    ) : (
      <Button {...buttonProps}>
        {actionLabel || 'Get Started'}
      </Button>
    );
  };

  return (
    <Card className={`p-4 ${config.containerClass} ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-xl">
          {config.icon}
        </div>
        <div className="flex-1">
          {title && (
            <h3 className={`text-lg font-medium mb-2 ${config.textClass}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${config.textClass}`}>
            {typeof message === 'string' ? (
              <p>{message}</p>
            ) : (
              message
            )}
          </div>
          {action && (actionLink || onAction) && (
            <div className="mt-4">
              {renderActionButton()}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default InfoMessage;

