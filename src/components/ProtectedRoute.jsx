import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { getUserData } from '../_actions';
import {
  checkFeatures,
  checkFeatureToggles,
  checkPerms,
  getFirstEntry,
  isContractor,
  sideBarShow
} from '../helpers/utils';
import { clearLocalStorage } from '../helpers/localStorage';

const ProtectedRoute = ({ component, path, visible, exact, name, detail, feature }) => {
  const user = getUserData();
  const param = window.location.pathname;
  if (visible === 'protected' && !user.logged_in) return <Redirect to={`/login?q=${param}`} />;
  if (path.includes('reset-password')) {
    clearLocalStorage();
    return <Route exact={exact} path={path} component={component} />;
  }
  if (visible === 'unauthorized' && user.logged_in)
    return <Redirect to={{ pathname: getFirstEntry() }} />;
  if (name === 'quick_dispatch_enabled' && sideBarShow(name) && checkFeatures(feature)) {
    return <Route exact={exact} path={path} component={component} />;
  }
  if (name === 'quick_dispatch_enabled') {
    return <Redirect to={{ pathname: '/404' }} />;
  }
  if (!checkPerms(name, user)) {
    return <Redirect to={{ pathname: '/404' }} />;
  }
  if (name === 'workorders_enabled' && detail && isContractor()) {
    return <Redirect to={{ pathname: '/404' }} />;
  }
  if (name === 'workorders_enabled' && !sideBarShow(name, path)) {
    return <Redirect to={{ pathname: '/404' }} />;
  }
  if (name === 'test_tracking_enabled' && !sideBarShow(name)) {
    return <Redirect to={{ pathname: '/404' }} />;
  }
  if (name === 'inventory_management_enabled' && !checkFeatureToggles(name)) {
    return <Redirect to={{ pathname: '/404' }} />;
  }
  if (feature && !checkFeatures(feature)) {
    return <Redirect to={{ pathname: '/404' }} />;
  }
  return <Route exact={exact} path={path} component={component} />;
};

ProtectedRoute.propTypes = {
  // component: PropTypes.func.isRequired,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  path: PropTypes.string.isRequired,
  visible: PropTypes.string.isRequired,
  exact: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  detail: PropTypes.bool,
  feature: PropTypes.string
};

ProtectedRoute.defaultProps = {
  component: () => {},
  detail: false,
  feature: ''
};

export default ProtectedRoute;
