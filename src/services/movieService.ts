import axios from "axios";
import type { Movie } from "../component/types/movie";

interface FetchMoviesResponse {
  results: Movie[];
  total_pages: number;
  page: number;
  total_results: number;
}
const BASE_URL = "https://api.themoviedb.org/3";
const myKey = import.meta.env.VITE_API_KEY;

export async function fetchMovies(query: string, page: number = 1) {
  const response = await axios.get<FetchMoviesResponse>(
    `${BASE_URL}/search/movie`,
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    },
  );

  return response.data;
}
