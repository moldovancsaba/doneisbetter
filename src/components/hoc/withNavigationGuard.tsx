import { useRouter } from 'next/navigation';

export const withNavigationGuard = (WrappedComponent: React.ComponentType) => {
  return function GuardedComponent(props: any) {
    const router = useRouter();
    return <WrappedComponent {...props} />;
  };
};
