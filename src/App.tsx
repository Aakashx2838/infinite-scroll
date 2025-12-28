import { useState } from "react";
import InfiniteScrollWithIntersectionObserverAndTanstackQuery from "./components/intersection-observer";
import InfiniteScrollWithVirtualizationAndTanstackQuery from "./components/virtualized";
import { API_BASE } from "./constants/config";
import { useQueryClient } from "@tanstack/react-query";

type TComment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export default function App() {
  const qc = useQueryClient();

  const [mode, setMode] = useState<"virtualization" | "intersection-observer">(
    "intersection-observer"
  );

  const handleClick = (updated: "virtualization" | "intersection-observer") => {
    setMode(updated);
    qc.clear();
  };

  return (
    <div className="space-y-4 p-4">
      <div className="border border-slate-200 rounded-md p-1 w-fit flex items-center gap-1 [&_button]:px-3 [&_button]:py-1 [&_button]:rounded-md mx-auto">
        <button
          onClick={() => handleClick("intersection-observer")}
          className={
            mode === "intersection-observer"
              ? "bg-blue-500 text-white"
              : "bg-slate-200"
          }
        >
          Intersection Observer
        </button>
        <button
          onClick={() => handleClick("virtualization")}
          className={
            mode === "virtualization"
              ? "bg-blue-500 text-white"
              : "bg-slate-200"
          }
        >
          Virtualization
        </button>
      </div>
      {mode === "intersection-observer" && (
        <InfiniteScrollWithIntersectionObserverAndTanstackQuery
          queryKey={["test", "infinite"]}
          queryFn={async ({ pageParam }) => {
            const LIMIT = 10;

            const query = new URLSearchParams({
              _page: pageParam.toString(),
              _limit: LIMIT.toString(),
            });

            const res = await fetch(`${API_BASE}/comments?${query.toString()}`);

            const data: TComment[] = await res.json();

            return {
              results: data,
              pagination: {
                next: 500 / LIMIT > pageParam ? pageParam + 1 : null,
              },
            };
          }}
          initialPageParam={1}
          getNextPageParam={(data) => data.pagination.next}
          getItem={(data) => data.results}
          getIdentifier={(item) => item.id}
        >
          {(item) => <div>{item.name}</div>}
        </InfiniteScrollWithIntersectionObserverAndTanstackQuery>
      )}
      {mode === "virtualization" && (
        <InfiniteScrollWithVirtualizationAndTanstackQuery
          queryKey={["test", "infinite"]}
          queryFn={async ({ pageParam }) => {
            const LIMIT = 10;

            const query = new URLSearchParams({
              _page: pageParam.toString(),
              _limit: LIMIT.toString(),
            });

            const res = await fetch(`${API_BASE}/comments?${query.toString()}`);

            const data: TComment[] = await res.json();

            return {
              results: data,
              pagination: {
                next: 500 / LIMIT > pageParam ? pageParam + 1 : null,
              },
            };
          }}
          initialPageParam={1}
          getNextPageParam={(data) => data.pagination.next}
          getItem={(data) => data.results}
          components={{
            ItemWrapper: ({ children }) => (
              <div className="pb-4">{children}</div>
            ),
          }}
        >
          {(item) => <div>{item.name}</div>}
        </InfiniteScrollWithVirtualizationAndTanstackQuery>
      )}
    </div>
  );
}
