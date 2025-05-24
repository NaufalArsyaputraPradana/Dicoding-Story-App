import HomePage from '../pages/home-page';
import AboutPage from '../pages/about-page';
import LoginPage from '../pages/login-page';
import RegisterPage from '../pages/register-page';
import StoryDetailPage from '../pages/story-detail-page';
import AddStoryPage from '../pages/add-story-page';
import NotFoundPage from '../pages/not-found-page';
import SavedStoriesPage from '../pages/saved-stories-page';

const routes = {
  '#/': HomePage,
  '#/about': AboutPage,
  '#/login': LoginPage,
  '#/register': RegisterPage,
  '#/stories/:id': StoryDetailPage,
  '#/stories/add': AddStoryPage,
  '#/saved': SavedStoriesPage,
  '#/404': NotFoundPage,
};

export default routes;
