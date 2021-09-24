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
import {LANG_EN, ROLE_GUEST} from "../../common/constants";
import {convertedRole} from "../../common/utils";
import Profile from "../Profile";
import PasswordChange from "../PasswordChange";
import Page404 from "../Page404";
import Users from "../Users";
import UserCreate from "../UserCreate";
import SidePane from "../SidePane";
import TranslationsTable from "../TranslationsTable";
import TranslationEdit from "../TranslationEdit";


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
        }
        if (!!token) {
            apiClient.setAuthorizationHeader(token)
        }
        this.tableRef = createRef()
        i18n.changeLanguage(lang)
    }

    setFilters = (filters) => {
        this.setState({filters: {...this.state.filters, ...filters}})
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
        this.setRefreshTable(true)
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


    // login = (e, requestData) => {
    //     e.preventDefault()
    //     // START LOADING SCREEN HERE
    //     this.setState(state => {
    //         state.loginForm.processing = true
    //         return state
    //     })
    //
    //     apiClient.login(requestData).then(({status, data}) => {
    //         if (status === 200) {
    //             localStorage.setItem('token', data.token)
    //             this.setState(state => {
    //                 state.loggedIn = true
    //                 state.loginForm.processing = false
    //                 return state
    //             })
    //             this.setUserDetails()
    //         } else {
    //             // this.setState({loginFormError: 'Please enter a correct username and password. Note that both fields may be case-sensitive.'})
    //             this.setState(state => {
    //                 state.loginForm.processing = false
    //                 state.loginForm.error = 'Please enter a correct username and password. Note that both fields may be case-sensitive.'
    //                 return state
    //             })
    //         }
    //     })
    // }

    logout = (e, data) => {
        apiClient.logout()
        localStorage.removeItem('token')
        this.setState({loggedIn: false})
    }

    setUserDetails = () => {
        // TODO handle request failure
        return apiClient.get(apiPathUserDetails).then(({status, data}) => {
            if (status === 200) {
                this.setState({
                    user: {
                        name: data.username,
                        email: data.email,
                        role: convertedRole(data.role),
                        roleLang: data.role_related_language,
                    }
                })
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

        return (
            <div>
                <BrowserRouter>
                    <header>
                        <Nav
                            user={this.state.user}
                            loggedIn={this.state.loggedIn}
                            interfaceLang={this.state.interfaceLang}
                            languageChange={languageChange}
                            logoutClick={this.logout}
                        />
                    </header>

                    <Switch>
                        <AuthRoute exact path={reactPathIndex} loggedIn={this.state.loggedIn} type="private">
                            <section className="home">
                                <SidePane user={this.state.user} filters={this.state.filters}
                                          setFilters={this.setFilters}
                                          aggregations={this.state.aggregations}/>
                                <TranslationsTable
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
