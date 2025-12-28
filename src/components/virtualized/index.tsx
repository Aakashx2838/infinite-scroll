import {
  useInfiniteQuery,
  type DefaultError,
  type InfiniteData,
  type QueryKey,
  type UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import {
  useVirtualizer,
  useWindowVirtualizer,
  type VirtualizerOptions,
} from "@tanstack/react-virtual";
import type { Any } from "../../types";
import { useEffect, useMemo } from "react";
import { Root as SlotRoot } from "@radix-ui/react-slot";

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
  children: (item: Item, index: number) => React.ReactNode;
  virtualizer?: Partial<VirtualizerOptions<Any, Element>>;
  components?: {
    ItemWrapper?: React.ComponentType<{ children: React.ReactNode }>;
    ListWrapper?: React.ComponentType<{ children: React.ReactNode }>;
  };
};

export default function InfiniteScrollWithVirtualizationAndTanstackQuery<
  TQueryFnData,
  Item,
  TError extends DefaultError = DefaultError,
  TData extends InfiniteData<TQueryFnData> = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown
>({
  children,
  getItem,
  components,
  virtualizer: virtualizerOptions,
  ...infiniteQueryParams
}: TProps<TQueryFnData, Item, TError, TData, TQueryKey, TPageParam>) {
  const ListWrapper = components?.ListWrapper ?? "div";
  const ItemWrapper = components?.ItemWrapper ?? "div";

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(infiniteQueryParams);

  const items = useMemo(
    () => data?.pages.flatMap(getItem) ?? [],
    [data, getItem]
  );

  const parentVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: virtualizerOptions?.getScrollElement ?? (() => null),
    estimateSize: virtualizerOptions?.estimateSize ?? (() => 35),
    enabled: !!virtualizerOptions?.getScrollElement,
    ...virtualizerOptions,
  });

  const windowVirtualizer = useWindowVirtualizer({
    count: items.length,
    estimateSize: virtualizerOptions?.estimateSize ?? (() => 35),
    ...virtualizerOptions,
  });

  const virtualizer = virtualizerOptions?.getScrollElement
    ? parentVirtualizer
    : windowVirtualizer;

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse();

    if (
      lastItem &&
      lastItem.index >= items.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    items.length,
    virtualItems,
  ]);

  return (
    <SlotRoot
      style={{
        height: virtualizer.getTotalSize(),
        width: "100%",
        position: "relative",
      }}
    >
      <ListWrapper>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            transform: `translateY(${virtualItems[0]?.start}px)`,
          }}
        >
          {virtualItems.map((virtualized) => {
            const item = items[virtualized.index];

            return (
              <SlotRoot
                key={virtualized.key}
                data-index={virtualized.index}
                ref={virtualizer.measureElement}
              >
                <ItemWrapper>{children(item, virtualized.index)}</ItemWrapper>
              </SlotRoot>
            );
          })}
        </div>
      </ListWrapper>
    </SlotRoot>
  );
}
