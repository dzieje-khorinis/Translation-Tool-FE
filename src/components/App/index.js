import './style.css';
import Login from "../Login";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {
    reactPathLogin,
    reactPathIndex,
    apiPathUserDetails,
    reactPathProfile,
    reactPathChangePassword, reactPathUsers, reactPathUserCreate
} from "../../common/routes"
import AuthRoute from "../AuthRoute";
import {Component, createRef} from "react";
import Nav from "../Nav";
import {apiClient} from "../../common/apiClient";
import i18n from "i18next"
import {LANG_EN, ROLE_GUEST, ROLE_ADMIN, THEMES} from "../../common/constants";
import {convertedRole} from "../../common/utils";
import Profile from "../Profile";
import PasswordChange from "../PasswordChange";
import Page404 from "../Page404";
import Users from "../Users";
import UserCreate from "../UserCreate";
import SidePane from "../SidePane";
import TranslationsTable from "../TranslationsTable";
import TranslationEdit from "../TranslationEdit";
import ScrollToTop from '../ScrollToTop';
import LogoutConfirmation from '../LogoutConfirmation';


class App extends Component {
    constructor(props) {
        super(props);
        let token = localStorage.getItem('token')
        let lang = localStorage.getItem('lang') || LANG_EN
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
                dataLanguage: "en",
                searchTerm: "",
                group: "",
                state: "",
                states: [],
                path: "",
            },
            aggregations: {},
            translationsData: [],
            translationEdit: null,
            refreshTable: false,
            showLogoutConfirmation: false,
            table: {
                page: 0,
            },
            theme: 0,
        }
        if (!!token) {
            apiClient.setAuthorizationHeader(token)
        }
        this.tableRef = createRef()
        i18n.changeLanguage(lang)
    }

    changeTheme = () => {
        this.setState({theme: (this.state.theme + 1) % THEMES.length})
    }

    setPageState = (page) => {
        page = page || this.state.table.page
        this.setState({table: {...this.state.table, page: page}})
    }

    setFilters = (filters) => {
        this.setState({filters: {...this.state.filters, ...filters}})
        this.tableRef.current.onChangePage({}, 0)
    }

    setAggregations = (aggregations) => {
        this.setState({aggregations: aggregations})
    }

    setTranslationsData = (translationsData) => {
        this.setState({translationsData: translationsData})
    }

    openEditModal = (rowData) => {
        this.setState({translationEdit: rowData})
    }

    closeEditModal = () => {
        this.setState({translationEdit: null})
    }

    translationEditCallback = () => {
        this.tableRef.current.onChangePage({}, this.state.table.page)
    }

    setRefreshTable = (value) => {
        this.setState({refreshTable: value})
    }

    componentDidMount() {
        // TODO CHECK IF TOKEN IS VALID
        if (this.state.loggedIn) {
            this.setUserDetails()
        }
    }

    loginSuccessCallback = (data) => {
        localStorage.setItem('token', data.token)
        apiClient.setAuthorizationHeader(data.token)
        this.setState(state => {
            state.loggedIn = true
            return state
        })
        this.setUserDetails()
    }

    logout = () => {
        apiClient.logout()
        localStorage.removeItem('token')
        this.setState({loggedIn: false, showLogoutConfirmation: false})
    }

    setShowLogoutConfirmation = (value) => {
        this.setState({showLogoutConfirmation: value})
    }

    setUserDetails = () => {
        // TODO handle request failure
        return apiClient.get(apiPathUserDetails).then(({status, data}) => {
            if (status === 200) {
                let user = {
                    name: data.username,
                    email: data.email,
                    role: convertedRole(data.role),
                    roleLang: data.role_related_language,
                }
                let newState = {
                    user: user,
                    userInitialized: true,
                }
                if (user.role < ROLE_ADMIN) {
                    // no dataLanguage selection widget so we set it based on roleLang
                    newState.filters = {
                        ...this.state.filters,
                        dataLanguage: user.roleLang
                    }
                }
                this.setState(newState)
            } else {
                this.logout()
            }

        })
    }


    render() {
        function languageChange(lang) {
            localStorage.setItem('lang', lang)
            i18n.changeLanguage(lang)
            apiClient.setAcceptLanguageHeader(lang)
            // setCookie("django_language", lang)
        }
        if (this.state.loggedIn && !this.state.userInitialized) {
            return (
                <div className={THEMES[this.state.theme]}></div>
            )
        }

        return (
            <div className={THEMES[this.state.theme]}>
                <BrowserRouter>
                    <header>
                        <Nav
                            user={this.state.user}
                            loggedIn={this.state.loggedIn}
                            interfaceLang={this.state.interfaceLang}
                            languageChange={languageChange}
                            logoutClick={e => this.setShowLogoutConfirmation(true)}
                            changeTheme={this.changeTheme}
                        />
                        <ScrollToTop/>
                        {
                            this.state.showLogoutConfirmation &&
                            <LogoutConfirmation
                                setShowLogoutConfirmation={this.setShowLogoutConfirmation}
                                logout={this.logout}
                            />
                        }
                    </header>

                    <Switch>
                        <AuthRoute exact path={reactPathIndex} loggedIn={this.state.loggedIn} type="private">
                            <section className="home">
                                <SidePane user={this.state.user} filters={this.state.filters}
                                          setFilters={this.setFilters}
                                          aggregations={this.state.aggregations}
                                          themeName={THEMES[this.state.theme]}/>
                                <TranslationsTable
                                    setPageState={this.setPageState}
                                    filters={this.state.filters}
                                    tableRef={this.tableRef}
                                    setAggregations={this.setAggregations}
                                    setTranslationsData={this.setTranslationsData}
                                    openEditModal={this.openEditModal}
                                    refreshTable={this.state.refreshTable}
                                    setRefreshTable={this.setRefreshTable}
                                />
                                {
                                    this.state.translationEdit &&
                                    <TranslationEdit
                                        user={this.state.user}
                                        dataLanguage={this.state.filters.dataLanguage}
                                        translationData={this.state.translationEdit}
                                        closeEditModal={this.closeEditModal}
                                        editCallback={this.translationEditCallback}
                                    />
                                }
                            </section>
                        </AuthRoute>

                        <AuthRoute exact path={reactPathProfile} loggedIn={this.state.loggedIn} type="private">
                            <Profile user={this.state.user}></Profile>
                        </AuthRoute>

                        <AuthRoute exact path={reactPathChangePassword} loggedIn={this.state.loggedIn} type="private">
                            <PasswordChange user={this.state.user}></PasswordChange>
                        </AuthRoute>

                        <AuthRoute exact path={reactPathUsers} loggedIn={this.state.loggedIn} type="private">
                            <Users></Users>
                        </AuthRoute>

                        <AuthRoute exact path={reactPathUserCreate} loggedIn={this.state.loggedIn} type="private">
                            <UserCreate user={this.state.user}></UserCreate>
                        </AuthRoute>


                        <AuthRoute path={reactPathLogin} loggedIn={this.state.loggedIn} type="guest">
                            <Login successCallback={this.loginSuccessCallback}/>
                        </AuthRoute>
                        <Route path="*" component={Page404}/>
                    </Switch>
                </BrowserRouter>

            </div>
        )
    }
}


export default App;
