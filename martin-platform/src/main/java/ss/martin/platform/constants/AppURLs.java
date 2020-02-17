/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ss.martin.platform.constants;

/**
 * Application URLs.
 * @author ss
 */
public class AppURLs {
    /** CRM application login. */
    public static final String APP_CRM_LOGIN = "/login";
    /** CRM application logout. */
    public static final String APP_CRM_LOGOUT = "/logout";
    /** CRM application login page. */
    public static final String APP_CRM_LOGIN_PAGE = "/welcome";
    /** CRM finish registration. */
    public static final String APP_CRM_FINISH_REGISTRATION = "/finish-registration";
    /** CRM application. */
    public static final String APP_CRM = "/crm";
    /** CRM application REST API. */
    public static final String APP_CRM_REST_API = APP_CRM + "/api";
    /** CRM application public API. */
    public static final String APP_CRM_PUBLIC_REST_API = APP_CRM_REST_API + "/public";
    /** CRM application views. */
    public static final String APP_CRM_VIEWS = APP_CRM + "/view";
}
