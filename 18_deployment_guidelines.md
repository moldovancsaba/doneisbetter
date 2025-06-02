# Deployment Guidelines [2025-06-02T10:24:03Z]

## Environment Configuration

### Cache Control Settings

1. **Environment Variables**
```plaintext
# Required environment variables in .env file
NEXT_PUBLIC_DISABLE_CACHE=true
NEXT_PUBLIC_FORCE_LOGIN=true

# Optional environment variables
NEXT_PUBLIC_DEBUG_THEME=true  # Enable theme context debugging
```

2. **Vercel Configuration**
Add the following to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, no-cache, must-revalidate, proxy-revalidate"
        },
        {
          "key": "Pragma",
          "value": "no-cache"
        },
        {
          "key": "Expires",
          "value": "0"
        }
      ]
    }
  ]
}
```

3. **Nginx Configuration**
If using Nginx, add to your site configuration:
```nginx
location / {
    add_header Cache-Control 'no-store, no-cache, must-revalidate, proxy-revalidate';
    add_header Pragma 'no-cache';
    expires 0;
}
```

## Development Setup

### First Time Setup

1. Clone repository
2. Copy environment configuration:
```bash
cp .env.example .env
```
3. Install dependencies:
```bash
npm install
```
4. Build the project:
```bash
npm run build
```
5. Start development server:
```bash
npm run dev
```

### Clearing Development Environment

```bash
# Remove development artifacts
rm -rf .next
rm -rf node_modules/.cache

# Clean install dependencies
rm -rf node_modules
npm install

# Rebuild the application
npm run build

# Start in development mode
npm run dev
```

## Browser Configuration

### Development Tools

1. Chrome DevTools settings:
   - Open DevTools (F12)
   - Go to Network tab
   - Check "Disable cache"
   - Enable "Preserve log"

2. React Developer Tools:
   - Install React Developer Tools extension
   - Enable "Highlight updates when components render"
   - Use Components tab to inspect ModuleTheme context

### Cache Clearing

1. Clear site data:
   - Open Chrome settings
   - Go to Privacy and security
   - Click "Clear browsing data"
   - Select "All time" for time range
   - Check all options
   - Click "Clear data"

2. Development mode:
   - Use incognito mode for testing
   - Clear cache between major changes
   - Test on multiple browsers

## Monitoring

### Theme Context Debugging

1. Browser Console
```javascript
// Add to browser console
window.checkTheme = () => {
  console.log('Current theme:', document.documentElement.dataset.theme);
  console.log('ModuleTheme:', window.__NEXT_DATA__.props.moduleTheme);
}
```

2. React DevTools
   - Inspect ModuleThemeProvider component
   - Check theme context values
   - Monitor component re-renders

### Error Monitoring

1. Console monitoring:
   - Watch for React warnings
   - Check for theme context errors
   - Monitor network request errors

2. Performance monitoring:
   - Check component mounting order
   - Monitor render timing
   - Watch for unnecessary re-renders

## Deployment Checklist

### Pre-deployment

1. Environment variables:
   - [ ] Check .env configuration
   - [ ] Verify cache control settings
   - [ ] Confirm debug settings

2. Build verification:
   - [ ] Clean and rebuild project
   - [ ] Check for build warnings
   - [ ] Verify bundle size

3. Testing:
   - [ ] Test all routes
   - [ ] Verify theme context
   - [ ] Check caching behavior

### Post-deployment

1. Cache verification:
   - [ ] Test first load behavior
   - [ ] Verify login/register flow
   - [ ] Check navigation caching

2. Theme context:
   - [ ] Verify all route themes
   - [ ] Check dark/light mode
   - [ ] Test theme persistence

3. Performance:
   - [ ] Check load times
   - [ ] Monitor error rates
   - [ ] Verify response headers

## Troubleshooting

### Common Issues

1. Theme context undefined:
   - Clear browser cache
   - Verify ModuleThemeProvider wrapping
   - Check component imports

2. Caching issues:
   - Verify environment variables
   - Check response headers
   - Clear browser cache

3. React hooks errors:
   - Check React version
   - Verify import statements
   - Ensure hooks usage rules

### Resolution Steps

1. For theme issues:
```bash
# Clear development cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

2. For caching issues:
```bash
# Verify environment
cat .env

# Check response headers
curl -I http://localhost:3000

# Clear npm cache
npm cache clean --force
```

## Maintenance

### Regular Tasks

1. Weekly:
   - Clear development cache
   - Update dependencies
   - Review error logs

2. Monthly:
   - Full cache clear
   - Environment review
   - Performance audit

### Version Control

1. Commit messages:
   - Include timestamp
   - Reference issue numbers
   - Describe purpose

2. Branch management:
   - Use feature branches
   - Regular main sync
   - Clean merged branches

## Notes

- All timestamps must use ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
- Environment variables take precedence over configuration files
- Always test in incognito mode first
- Monitor React DevTools for context issues
- Keep deployment documentation updated with changes

# Deployment Guidelines [2025-05-24T03:04:04.789Z]

## Overview

This document outlines the deployment process for DoneisBetter using Vercel, including environment setup, deployment procedures, and monitoring practices.

## Deployment Architecture

### Infrastructure
- Vercel (Frontend & API)
- MongoDB Atlas (Database)
- HTTP Polling (Real-time data updates)

### Environments
1. Development
   - Local development
   - Feature testing
   - Integration testing

2. Staging
   - Preview deployments
   - QA testing
   - Performance testing

3. Production
   - Live environment
   - Monitoring
   - Analytics

## Environment Setup

### Environment Variables
```env
# Database
MONGODB_URI=mongodb+srv://...
MONGODB_DB=doneisbetter

# Application
NEXT_PUBLIC_SITE_URL=https://doneisbetter.com
NODE_ENV=production

# Polling
HTTP_POLLING_INTERVAL=5000
```

### Vercel Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb-uri"
  }
}
```

## Deployment Process

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Documentation updated with ISO 8601 timestamps
- [ ] System documentation (24_system_documentation.md) updated if applicable
- [ ] Environment variables set
- [ ] Dependencies updated
- [ ] Performance verified
- [ ] Navigation components consistency verified:
  - [ ] Header.js menu items match Navigation.js and MobileNav.js
  - [ ] Menu emojis consistent across all components
  - [ ] Menu ordering consistent
  - [ ] Dark/light mode toggle functioning

### Deployment Steps
1. Code Review
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

2. Version Control
   ```bash
   git checkout main
   git pull origin main
   ```

3. Deploy Command
   ```bash
   vercel --prod
   ```

### Post-deployment Verification
1. Smoke Tests
   - Homepage loading
   - Authentication
   - HTTP polling functionality
   - Database operations
   - Navigation menu functionality
   - Cross-component consistency

2. Performance Checks
   - Page load times
   - API response times
   - Polling efficiency
   - Database queries
   - Navigation responsiveness

## Monitoring

### Performance Monitoring
- Vercel Analytics
- Custom metrics
- Error tracking
- User analytics

### Health Checks
1. API Endpoints
   - Response times
   - Error rates
   - Success rates

2. HTTP Polling
   - Response status
   - Data freshness
   - Polling frequency
   - Error handling

3. Database
   - Query performance
   - Connection pool
   - Error rates

## Rollback Procedures

### Immediate Rollback
```bash
vercel rollback
```

### Manual Rollback Steps
1. Identify issue
2. Revert commit
3. Deploy previous version
4. Verify functionality

## Security Measures

### Access Control
- Environment variables
- API keys
- Database credentials
- Deployment tokens

### Security Headers
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Additional security headers
        ]
      }
    ]
  }
}
```

## Deployment Schedule

### Regular Deployments
- Feature releases: As completed
- Bug fixes: As needed
- Security updates: Immediate
- Documentation: With code changes (with ISO 8601 timestamps)
- Navigation updates: After cross-component verification

### Maintenance Windows
- Scheduled: Monthly
- Emergency: As needed
- Database: Coordinated

## Troubleshooting

### Common Issues
1. Build Failures
   - Check logs
   - Verify dependencies
   - Check environment

2. Runtime Errors
   - Check logs
   - Monitor metrics
   - Review traces

3. Performance Issues
   - Check analytics
   - Review metrics
   - Optimize code
   - Verify polling efficiency

4. Navigation Inconsistencies
   - Check Header.js implementation
   - Verify MobileNav.js consistency
   - Confirm Navigation.js alignment
   - Test across device sizes

## Version Control

- Documentation Version: 1.1.0
- Last Updated: 2025-05-24T03:04:04.789Z
- Update Frequency: With each deployment change

## Related Documentation
- [19_monitoring_setup.md](19_monitoring_setup.md)
- [12_deployment_log.md](12_deployment_log.md)
- [15_architecture_and_design.md](15_architecture_and_design.md)
- [24_system_documentation.md](24_system_documentation.md)

## Documentation Verification Checklist

Prior to deployment, verify that:

- [ ] All documentation has been updated with ISO 8601 timestamp format (YYYY-MM-DDThh:mm:ss.SSSZ)
- [ ] System documentation reflects current architecture and components
- [ ] Navigation component structure is documented correctly
- [ ] Component emoji standards are documented
- [ ] Deployment log is prepared to record the new deployment
- [ ] Version histories are updated in all modified documents

## Version History
- Initial deployment guidelines: 2025-05-22T10:45:32.789Z
- Updated with navigation consistency checks and HTTP polling: 2025-05-24T03:04:04.789Z

