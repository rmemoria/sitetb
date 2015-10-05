package org.msh.etbm.web.api.authentication;

import org.msh.etbm.services.usersession.UserSession;
import org.msh.etbm.services.usersession.UserSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;
import java.util.UUID;

/**
 * Authenticator interceptor, called when a call is made to check if the request requires authentication
 *
 * Created by ricardo on 03/12/14.
 */
@Component
public class AuthenticatorInterceptor extends HandlerInterceptorAdapter  {

    @Autowired
    UserSessionService userSessionService;


    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // check if route requires authentication
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod)handler;
        Method method = handlerMethod.getMethod();

        Authenticated auth = method.getAnnotation(Authenticated.class);
        if (auth == null) {
            auth = method.getDeclaringClass().getAnnotation(Authenticated.class);
        }

        // if no authentication is required, so return
        if (auth == null) {
            return true;
        }

        UserSession session = checkAuthenticated(request);

        // if there is no token, or token is invalid, return unauthorized
        if (session == null) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Not authorized");
            return false;
        }

        // check if user has permissions
        if (!checkAuthorized(auth.permissions, session)) {
            response.sendError(HttpStatus.FORBIDDEN.value(), "Operation forbidden");
        }

        return true;
    }


    /**
     * Check if the user is authenticated to the system
     * @param request the object representing the request
     * @return information about the user session, or null if authentication is not valid
     */
    private UserSession checkAuthenticated(HttpServletRequest request) {
        // get the authentication token in the request
        String stoken = request.getHeader(AuthConstants.AUTH_TOKEN_HEADERNAME);

        if (stoken == null &&
                request.getQueryString() != null &&
                request.getQueryString().contains(AuthConstants.AUTH_TOKEN_HEADERNAME))
        {
            stoken = request.getParameter(AuthConstants.AUTH_TOKEN_HEADERNAME);
        }

        if (stoken == null) {
            return null;
        }

        UUID authToken = UUID.fromString(stoken);

        // get information about the user session
        UserSession session = userSessionService.getSessionByAuthToken(authToken);
        if (session == null) {
            return null;
        }

        // set the token and user session as an attribute of the request to be used further in the code
        request.setAttribute(UserSessionService.SESSION_ID, authToken);
        request.setAttribute(UserSessionService.SESSION_KEY, session);

        return session;
    }


    /**
     * Check if user has permissions to go on with the request
     * @param perms list of roles allowed for the request
     * @param userSession information about the user session
     * @return true if user has the permissions necessary to continue
     */
    private boolean checkAuthorized(String perms[], UserSession userSession) {
        if (perms == null || perms.length == 0) {
            return true;
        }

        for (String p: perms) {
            if (!userSession.isPermissionGranted(p)) {
                return false;
            }
        }
        return true;
    }

}
