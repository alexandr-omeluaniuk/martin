/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ss.martin.application.config;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import ss.martin.platform.constants.AppURLs;

/**
 * Web application configuration.
 * @author Alexandr Omeluaniuk
 */
@Configuration
@EnableAutoConfiguration
@ComponentScan("ss.martin")
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(AppURLs.APP_CRM_LOGIN_PAGE)
                .addResourceLocations("classpath:/static/martin-platform-client/build/");
        registry.addResourceHandler(AppURLs.APP_CRM_FINISH_REGISTRATION)
                .addResourceLocations("classpath:/static/martin-platform-client/build/");
        registry.addResourceHandler("/**").addResourceLocations("classpath:/static/martin-platform-client/build/");     
    }
    /**
     * Forward some URLs to index page.
     * Required for React app routing navigation.
     * @return configuration.
     */
    @Bean
    public WebMvcConfigurer forwardToIndex() {
        return new WebMvcConfigurer() {
            @Override
            public void addViewControllers(ViewControllerRegistry registry) {
                final String forward = "forward:/index.html";
                registry.addViewController("/").setViewName(forward);
                registry.addViewController(AppURLs.APP_CRM_LOGIN_PAGE).setViewName(forward);
                registry.addViewController(AppURLs.APP_CRM_FINISH_REGISTRATION + "/**").setViewName(forward);
                registry.addViewController(AppURLs.APP_CRM_VIEWS + "/**").setViewName(forward);
            }
        };
    }
}
