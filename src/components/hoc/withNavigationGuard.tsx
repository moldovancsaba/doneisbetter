import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { hasRemainingUnswiped } from '@/utils/navigationValidation';

export const withNavigationGuard = (WrappedComponent: React.ComponentType) => {
  return function GuardedComponent(props: any) {
    const router = useRouter();
    const [isRouteGuarded, setIsRouteGuarded] = useState(false);

    useEffect(() => {
      // Intercept navigation attempts to /ranking
      const handleRouteChange = async () => {
        const hasUnswiped = await hasRemainingUnswiped();
        if (hasUnswiped) {
          setIsRouteGuarded(true);
          // Keep user on /play
          router.push('/play');
          return;
        }
        router.push('/ranking');
      };

      const handleRankingClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isRankingLink = target.closest('a')?.href?.includes('/ranking');
        
        if (isRankingLink) {
          e.preventDefault();
          handleRouteChange();
        }
      };

      document.addEventListener('click', handleRankingClick);
      return () => {
        document.removeEventListener('click', handleRankingClick);
      };
    }, [router]);

    return <WrappedComponent {...props} isRouteGuarded={isRouteGuarded} />;
  };
};
