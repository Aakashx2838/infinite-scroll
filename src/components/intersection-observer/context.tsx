import { createContext, use, useMemo } from "react";

type TProps<T = unknown> = {
  children: React.ReactNode;
  data: T;
};

type TInfiniteScrollWithIntersectionObserverContext<T = unknown> = {
  data: T;
};

const InfiniteScrollWithIntersectionObserverContext =
  createContext<TInfiniteScrollWithIntersectionObserverContext | null>(null);

export default function InfiniteScrollWithIntersectionObserverProvider<T>({
  children,
  data,
}: TProps<T>) {
  const value = useMemo<TInfiniteScrollWithIntersectionObserverContext<T>>(
    () => ({
      data,
    }),
    [data]
  );

  return (
    <InfiniteScrollWithIntersectionObserverContext value={value}>
      {children}
    </InfiniteScrollWithIntersectionObserverContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInfiniteScrollWithIntersectionObserverContext<T>() {
  const context = use(InfiniteScrollWithIntersectionObserverContext);

  if (!context) {
    throw new Error(
      "useInfiniteScrollWithIntersectionObserverContext must be used within InfiniteScrollWithIntersectionObserverProvider"
    );
  }
  return context as TInfiniteScrollWithIntersectionObserverContext<T>;
}
