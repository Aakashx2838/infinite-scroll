import {
  useInfiniteQuery,
  type DefaultError,
  type InfiniteData,
  type QueryKey,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { Fragment } from "react/jsx-runtime";
import useIntersection from "./useIntersectionObserver";
import { useEffect, useRef } from "react";

type TProps<
  TQueryFnData,
  Item,
  TError extends DefaultError = DefaultError,
  TData extends InfiniteData<TQueryFnData> = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown
> = UseInfiniteQueryOptions<
  TQueryFnData,
  TError,
  TData,
  TQueryKey,
  TPageParam
> & {
  getItem: (data: TQueryFnData) => Item[];
  getIdentifier: (item: Item) => string | number;
  children: (item: Item, index: number) => React.ReactNode;
  intersection?: IntersectionObserverInit;
};

export default function InfiniteScrollWithIntersectionObserverAndTanstackQuery<
  TQueryFnData,
  Item,
  TError extends DefaultError = DefaultError,
  TData extends InfiniteData<TQueryFnData> = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown
>({
  children,
  getItem,
  getIdentifier,
  intersection: intersectionOptions,
  ...infiniteQueryParams
}: TProps<TQueryFnData, Item, TError, TData, TQueryKey, TPageParam>) {
  const ref = useRef<HTMLSpanElement>(null);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(infiniteQueryParams);

  const observer = useIntersection(ref, {
    threshold: intersectionOptions?.threshold,
    root: intersectionOptions?.root,
    rootMargin: intersectionOptions?.rootMargin,
  });

  useEffect(() => {
    if (observer?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    observer?.isIntersecting,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  ]);

  return (
    <Fragment>
      {data?.pages.flatMap(getItem).map((item, index) => (
        <Fragment key={getIdentifier(item)}>{children(item, index)}</Fragment>
      ))}
      <span ref={ref}>Hello</span>
    </Fragment>
  );
}
