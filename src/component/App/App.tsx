import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { fetchMovies } from "../../services/movieService";
import { Toaster } from "react-hot-toast";
import type { Movie } from "../types/movie";
import css from "./App.module.css";

import ReactPaginateModule from "react-paginate";
const ReactPaginate = (ReactPaginateModule as any).default;

import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", searchQuery, currentPage],
    queryFn: () => fetchMovies(searchQuery, currentPage),
    enabled: searchQuery !== "",
    placeholderData: keepPreviousData,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const totalPages = data?.total_pages ?? 0;
  const movies = data?.results ?? [];

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleGetSearch = async (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <>
      <SearchBar onSubmit={handleGetSearch} />
      <Toaster position="top-center" reverseOrder={false} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      <MovieGrid movies={movies} onSelect={handleSelectMovie} />

      {!isLoading && !isError && movies.length > 0 && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}
