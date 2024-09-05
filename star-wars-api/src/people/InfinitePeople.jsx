import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";
import { Person } from "./Person";
const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ["sw-people"],
      queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    });
  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">Oops something went wrong...</div>;
  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll
        initialLoad={false}
        loadMore={() => {
          if (!isFetching) {
            fetchNextPage();
          }
        }}
        hasMore={hasNextPage}
      >
        {data.pages.map((pageData) => {
          return pageData.results.map((person) => {
            return (
              <Person
                key={person.name}
                name={person.name}
                eyeColor={person.eye_color}
                hairColor={person.hair_color}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
