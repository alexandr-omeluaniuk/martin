/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ss.martin.platform.spring.config;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
@ComponentScan({"ss.martin"})
@EntityScan("ss.martin.platform.entity")
public class WebConfig implements WebMvcConfigurer {
    /** Available applications. */
    private static final String[] APPLICATIONS = new String[] {
        AppURLs.APP_CRM
    };
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(AppURLs.APP_CRM_LOGIN_PAGE)
                .addResourceLocations("classpath:/static" + AppURLs.APP_CRM + "/build/");
        for (String app : APPLICATIONS) {
            registry.addResourceHandler(app + "/**").addResourceLocations("classpath:/static/" + app + "/build/");
        }
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
                registry.addViewController(AppURLs.APP_CRM_LOGIN_PAGE)
                        .setViewName("forward:" + AppURLs.APP_CRM + "/index.html");
                for (String app : APPLICATIONS) {
                    registry.addViewController(app).setViewName("forward:" + app + "/index.html");
                    registry.addViewController(app + "/view/**").setViewName("forward:" + app + "/index.html");
                }
            }
        };
    }
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return bCryptPasswordEncoder;
    }
}
