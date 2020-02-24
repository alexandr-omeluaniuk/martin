/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    resources: {
        ru: {
            translation: {
                notification: {
                    changesSaved: 'Изменения сохранены'
                },
                toolbar: {
                    accountmenu: {
                        logout: 'Выход'
                    }
                },
                constants: {
                    momentJsDateFormat: 'DD.MM.YYYY'
                },
                menu: {
                    dashboard: "Обзор"
                },
                loginPage: {
                    signIn: 'Войти в систему',
                    forgotPassword: 'Забыли пароль?',
                    emailAddress: 'Адрес электронной почты',
                    password: 'Пароль',
                    rememberMe: 'Запомнить меня',
                    err: {
                        userNotFound: 'Данный адрес электронной почты не зарегистрирован',
                        badPassword: 'Неверный пароль',
                        userDeactivated: 'Учетная запись деактивирована'
                    }
                },
                finishRegistrationPage: {
                    title: 'Завершение регистрации',
                    finishRegistration: 'Завершить регистрацию',
                    enterPassword: 'Введите пароль',
                    enterPasswordRepeat: 'Повторите пароль',
                    passwordLength: 'Не короче 8 символов',
                    passwordNotMatch: 'Пароли не совпадают',
                    invalidLink: 'Ссылка больше недействительна'
                },
                validation: {
                    email: 'Неверный формат адреса электронной почты',
                    minLength: 'Не короче {{length}} символов',
                    maxLength: 'Не более {{length}} символов',
                    notnull: 'Обязательное поле',
                    notempty: 'Обязательное поле',
                    phone: 'Неверный номер телефона'
                },
                model: {
                    ss: {
                        martin: {
                            platform: {
                                entity: {
                                    Subscription: {
                                        label: {
                                            single: 'Подписка',
                                            many: 'Подписки'
                                        },
                                        field: {
                                            organizationName: 'Название организации',
                                            started: 'Начало подписки',
                                            expirationDate: 'Окончание подписки',
                                            subscriptionAdminEmail: 'Адрес электронной почты администратора',
                                            modules: 'Доступные приложения'
                                        }
                                    },
                                    SystemUser: {
                                        label: {
                                            single: 'Пользователь',
                                            many: 'Пользователи'
                                        },
                                        field: {
                                            avatar: 'Аватар',
                                            firstname: 'Имя',
                                            lastname: 'Фамилия',
                                            status: 'Статус',
                                            standardRole: 'Стандартная роль',
                                            email: 'Email'
                                        }
                                    }
                                }
                            },
                            module: {
                                crm: {
                                    entity: {
                                        Contact: {
                                            label: {
                                                single: 'Контакт',
                                                many: 'Контакты'
                                            },
                                            field: {
                                                avatar: 'Аватар',
                                                firstname: 'Имя',
                                                lastname: 'Фамилия',
                                                email: 'Адрес электронной почты',
                                                phoneMobile: 'Мобильный телефон'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                components: {
                    datatable: {
                        densePadding: 'Компактная таблица',
                        selectedRecords: 'Выбрано записей',
                        clearSelection: 'Очистить выделение',
                        toolbar: {
                            add: 'Новая запись'
                        }
                    },
                    window: {
                        save: 'Сохранить'
                    }
                },
                common: {
                    delete: 'Удалить',
                    edit: 'Редактировать',
                    upload: 'Загрузить',
                    clear: 'Очистить',
                    open: 'Открыть',
                    created: 'Создал',
                    modified: 'Изменил'
                },
                enum: {
                    SystemUserStatus: {
                        ACTIVE: 'Активный',
                        INACTIVE: 'Деактивирован',
                        REGISTRATION: 'В процессе регистрации'
                    },
                    StandardRole: {
                        ROLE_SUPER_ADMIN: 'Супер админстратор',
                        ROLE_SUBSCRIPTION_ADMINISTRATOR: 'Администратор',
                        ROLE_SUBSCRIPTION_USER: 'Пользователь'
                    },
                    ApplicationModule: {
                        CRM: 'Система управления клиентами'
                    }
                }
            }
        }
    },
    lng: "ru",
    fallbackLng: "ru",
    debug: false,
    interpolation: {
        escapeValue: false
    }
});

export default i18n;