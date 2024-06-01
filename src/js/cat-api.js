import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_nOdnL3Dj9jjF4zVLjteozldoqmiVUxxCRsrlPoRVyonLQDm4DFuaUNiaRzafsnXC';

/**
 * Makes a call to get an array of cat breed objects in a promise
 * @returns Promise<AxiosResponse<any, any>>
 */
export async function fetchBreeds() {
  return axios.get('https://api.thecatapi.com/v1/breeds');
}

/**
 * Makes a call to get detailed cat info by its breed_ids
 * @param {string} breed_ids
 * @returns Promise<AxiosResponse<any, any>>
 */
export async function fetchCatByBreed(breed_ids) {
  return axios.get('https://api.thecatapi.com/v1/images/search?', {
    params: { breed_ids },
  });
}
