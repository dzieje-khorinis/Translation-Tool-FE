import './style.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Component, createRef } from 'react';
import i18n from 'i18next';
import Login from '../Login';
import {
  reactPathLogin,
  reactPathIndex,
  apiPathUserDetails,
  reactPathProfile,
  reactPathHistory,
  reactPathChangePassword,
  reactPathUsers,
  reactPathUserCreate,
} from '../../common/routes';
import AuthRoute from '../AuthRoute';
import Nav from '../Nav';
import { apiClient } from '../../common/apiClient';
import {
  LANG_EN,
  ROLE_GUEST,
  ROLE_ADMIN,
  THEMES,
} from '../../common/constants';
import { convertedRole } from '../../common/utils';
import Profile from '../Profile';
import PasswordChange from '../PasswordChange';
import Page404 from '../Page404';
import Users from '../Users';
import UserCreate from '../UserCreate';
import SidePane from '../SidePane';
import TranslationsTable from '../TranslationsTable';
import TranslationEdit from '../TranslationEdit';
import ScrollToTop from '../ScrollToTop';
import LogoutConfirmation from '../LogoutConfirmation';
import GlobalTranslationHistory from '../GlobalTranslationHistory';

class App extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    const lang = localStorage.getItem('lang') || LANG_EN;
    this.state = {
      loggedIn: !!token,
      user: {
        name: '',
        email: '',
        role: ROLE_GUEST,
        roleLang: '',
      },
      userInitialized: false,

      interfaceLang: lang,
      filters: {
        dataLanguage: 'en',
        searchTerm: '',
        group: '',
        state: '',
        states: [],
        path: '',
      },
      aggregations: {},
      translationEditData: null,
      showLogoutConfirmation: false,
      table: {
        page: 0,
      },
      theme: 0,
    };
    if (token) {
      apiClient.setAuthorizationHeader(token);
    }
    this.tableRef = createRef();
    this.historyTableRef = createRef();
    i18n.changeLanguage(lang);
  }

  componentDidMount() {
    // TODO CHECK IF TOKEN IS VALID
    const { loggedIn } = this.state;

    if (loggedIn) {
      this.setUserDetails();
    }
  }

  setPageState = (page) => {
    const { table } = this.state;
    this.setState({ table: { ...table, page } });
  };

  changeTheme = () => {
    const { theme } = this.state;
    this.setState({ theme: (theme + 1) % THEMES.length });
  };

  setFilters = (newFilters) => {
    const { filters } = this.state;
    this.setState({ filters: { ...filters, ...newFilters } });
    this.tableRef.current.onChangePage({}, 0);
  };

  setAggregations = (aggregations) => {
    this.setState({ aggregations });
  };

  openEditModal = (rowData) => {
    this.setState({ translationEditData: rowData });
  };

  closeEditModal = () => {
    this.setState({ translationEditData: null });
  };

  translationEditCallback = () => {
    const { table } = this.state;
    this.tableRef.current.onChangePage({}, table.page);
  };

  loginSuccessCallback = (data) => {
    localStorage.setItem('token', data.token);
    apiClient.setAuthorizationHeader(data.token);
    this.setState((state) => {
      /* eslint-disable-next-line no-param-reassign */
      state.loggedIn = true;
      return state;
    });
    this.setUserDetails();
  };

  logout = () => {
    apiClient.logout();
    localStorage.removeItem('token');
    this.setState({ loggedIn: false, showLogoutConfirmation: false });
  };

  setShowLogoutConfirmation = (value) => {
    this.setState({ showLogoutConfirmation: value });
  };

  setUserDetails = () => {
    const { filters } = this.state;
    // TODO handle request failure
    return apiClient.get(apiPathUserDetails).then(({ status, data }) => {
      if (status === 200) {
        const user = {
          name: data.username,
          email: data.email,
          role: convertedRole(data.role),
          roleLang: data.role_related_language,
        };
        const newState = {
          user,
          userInitialized: true,
        };
        if (user.role < ROLE_ADMIN) {
          // no dataLanguage selection widget so we set it based on roleLang
          newState.filters = {
            ...filters,
            dataLanguage: user.roleLang,
          };
        }
        this.setState(newState);
      } else {
        this.logout();
      }
    });
  };

  languageChange = (lang) => {
    localStorage.setItem('lang', lang);
    i18n.changeLanguage(lang);
    apiClient.setAcceptLanguageHeader(lang);
  };

  render() {
    const {
      user,
      loggedIn,
      interfaceLang,
      theme,
      userInitialized,
      showLogoutConfirmation,
      filters,
      aggregations,
      translationEditData,
    } = this.state;

    if (loggedIn && !userInitialized) {
      return <div className={THEMES[theme]} />;
    }

    return (
      <div className={THEMES[theme]}>
        <BrowserRouter>
          <header>
            <Nav
              user={user}
              loggedIn={loggedIn}
              interfaceLang={interfaceLang}
              languageChange={this.languageChange}
              logoutClick={() => this.setShowLogoutConfirmation(true)}
              changeTheme={this.changeTheme}
            />
            <ScrollToTop />
            {showLogoutConfirmation && (
              <LogoutConfirmation
                setShowLogoutConfirmation={this.setShowLogoutConfirmation}
                logout={this.logout}
              />
            )}
          </header>

          <Switch>
            <AuthRoute
              exact
              path={reactPathIndex}
              loggedIn={loggedIn}
              type="private"
            >
              <section className="home">
                <SidePane
                  user={user}
                  filters={filters}
                  setFilters={this.setFilters}
                  aggregations={aggregations}
                  themeName={THEMES[theme]}
                />
                <TranslationsTable
                  setPageState={this.setPageState}
                  filters={filters}
                  tableRef={this.tableRef}
                  setAggregations={this.setAggregations}
                  openEditModal={this.openEditModal}
                />
                {translationEditData && (
                  <TranslationEdit
                    user={user}
                    dataLanguage={filters.dataLanguage}
                    translationData={translationEditData}
                    closeEditModal={this.closeEditModal}
                    editCallback={this.translationEditCallback}
                  />
                )}
              </section>
            </AuthRoute>

            <AuthRoute
              exact
              path={reactPathHistory}
              loggedIn={loggedIn}
              type="private"
            >
              <GlobalTranslationHistory tableRef={this.historyTableRef} />
            </AuthRoute>

            <AuthRoute
              exact
              path={reactPathProfile}
              loggedIn={loggedIn}
              type="private"
            >
              <Profile user={user} />
            </AuthRoute>

            <AuthRoute
              exact
              path={reactPathChangePassword}
              loggedIn={loggedIn}
              type="private"
            >
              <PasswordChange user={user} />
            </AuthRoute>

            <AuthRoute
              exact
              path={reactPathUsers}
              loggedIn={loggedIn}
              type="private"
            >
              <Users />
            </AuthRoute>

            <AuthRoute
              exact
              path={reactPathUserCreate}
              loggedIn={loggedIn}
              type="private"
            >
              <UserCreate user={user} />
            </AuthRoute>

            <AuthRoute path={reactPathLogin} loggedIn={loggedIn} type="guest">
              <Login successCallback={this.loginSuccessCallback} />
            </AuthRoute>
            <Route path="*" component={Page404} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
