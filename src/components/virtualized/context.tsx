import { createContext, use, useMemo } from "react";

type TProps<T = unknown> = {
  children: React.ReactNode;
  data: T;
};

type TInfiniteScrollWithVirtualizationContext<T = unknown> = {
  data: T;
};

const InfiniteScrollWithVirtualizationContext =
  createContext<TInfiniteScrollWithVirtualizationContext | null>(null);

export default function InfiniteScrollWithVirtualizationProvider<T>({
  children,
  data,
}: TProps<T>) {
  const value = useMemo<TInfiniteScrollWithVirtualizationContext<T>>(
    () => ({
      data,
    }),
    [data]
  );

  return (
    <InfiniteScrollWithVirtualizationContext value={value}>
      {children}
    </InfiniteScrollWithVirtualizationContext>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useInfiniteScrollWithVirtualizationContext<T>() {
  const context = use(InfiniteScrollWithVirtualizationContext);

  if (!context) {
    throw new Error(
      "useInfiniteScrollWithVirtualizationContext must be used within a InfiniteScrollWithVirtualizationProvider"
    );
  }
  return context as TInfiniteScrollWithVirtualizationContext<T>;
}
