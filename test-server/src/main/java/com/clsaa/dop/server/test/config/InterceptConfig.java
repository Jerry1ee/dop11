package com.clsaa.dop.server.test.config;

import com.clsaa.dop.server.test.interceptor.RequestUserInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

/**
 * @author xihao
 * @version 1.0
 * @since 02/04/2019
 */
@Configuration
public class InterceptConfig extends WebMvcConfigurationSupport {

    @Autowired
    private RequestUserInterceptor userInterceptor;

    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(userInterceptor).addPathPatterns("/*");
    }
}
