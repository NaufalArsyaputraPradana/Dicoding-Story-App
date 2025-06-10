import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from '../pages/auth/login/login-page';
import RegisterPage from '../pages/auth/register/register-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';
import AddStoryPage from '../pages/add/add-page';
import NotFoundPage from '../pages/not-found-page';
import SavedStoriesPage from '../pages/saved/saved-page';

// IMPROVISASI: Tambahkan rute fallback dan alias untuk kemudahan navigasi
const routes = {
  '#/': HomePage,
  '#/home': HomePage, // alias untuk beranda
  '#/about': AboutPage,
  '#/login': LoginPage,
  '#/register': RegisterPage,
  '#/stories/:id': StoryDetailPage,
  '#/stories/add': AddStoryPage,
  '#/saved': SavedStoriesPage,
  '#/favorites': SavedStoriesPage, // alias untuk halaman favorit
  '#/404': NotFoundPage,
  '*': NotFoundPage, // fallback wildcard
};

export default routes;
