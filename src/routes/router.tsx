import { createBrowserRouter } from 'react-router-dom';
import { routeObjects } from './routeObjects';

/** Browser router built from the shared route table in `routeObjects.tsx`. */
export const router = createBrowserRouter(routeObjects);
