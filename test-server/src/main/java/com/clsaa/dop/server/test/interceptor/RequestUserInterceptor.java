package com.clsaa.dop.server.test.interceptor;

import com.clsaa.dop.server.test.util.UserUtils;
import com.clsaa.rest.result.bizassert.BizAssert;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.metrics.web.servlet.LongTaskTimingHandlerInterceptor;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.apache.commons.lang3.StringUtils.isEmpty;

/**
 * @author xihao
 * @version 1.0
 * @since 02/04/2019
 */
@Component
public class RequestUserInterceptor implements HandlerInterceptor {

    @Value("${system.loginNeeded:true}")
    private Boolean loginNeeded;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String userId = request.getHeader("x-login-user");
        if (isEmpty(userId) && loginNeeded) {
            BizAssert.justUnauthorized("You should login first before accessing the system!");
        }
        try {
            UserUtils.setUserId(Long.valueOf(userId));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        UserUtils.removeThreadUserId();
    }
}
