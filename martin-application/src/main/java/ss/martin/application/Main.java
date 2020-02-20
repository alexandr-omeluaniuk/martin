/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package ss.martin.application;

import org.springframework.boot.SpringApplication;
import ss.martin.application.spring.config.WebConfig;

/**
 * Application entry point.
 * @author ss
 */
public class Main {
    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(WebConfig.class, args);
    }
}
