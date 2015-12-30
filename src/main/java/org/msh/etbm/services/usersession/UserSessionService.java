package org.msh.etbm.services.usersession;

import org.dozer.DozerBeanMapper;
import org.msh.etbm.CacheConfiguration;
import org.msh.etbm.commons.SynchronizableItem;
import org.msh.etbm.db.entities.*;
import org.msh.etbm.services.permissions.Permission;
import org.msh.etbm.services.permissions.Permissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Service to return information about the on-going user session under the current request
 *
 * Created by rmemoria on 30/9/15.
 */
@Service
@Configuration
public class UserSessionService {

    @PersistenceContext
    EntityManager entityManager;

    @Autowired
    DozerBeanMapper mapper;

    @Autowired
    Permissions permissions;


    /**
     * Return the user session information by its authentication token
     * @param authToken the authentication token
     * @return instance of the user session, or null if authentication token is invalid
     */
    @Transactional
    @Cacheable(value = CacheConfiguration.CACHE_SESSION_ID, unless = "#result == null")
    public UserSession getSessionByAuthToken(UUID authToken) {
        UserLogin login = entityManager.find(UserLogin.class, authToken);
        if (login == null) {
            return null;
        }

        // recover the information of the user in the workspace
        UserWorkspace uw = getUserWorkspace(login.getUser(), login.getWorkspace());

        if (uw == null) {
            System.out.println("User workspace not found. user=" + login.getUser().toString() + ", workspace=" + login.getWorkspace().toString());
            return null;
//            throw new IllegalArgumentException("User workspace not found");
        }

        UserSession session = mapper.map(uw, UserSession.class);

        session.setUserLoginId(login.getId());

        if (!uw.isAdministrator()) {
            List<String> perms = createPermissionList(uw);
            session.setPermissions(perms);
        }

        return session;
    }


    @Transactional
    public UserSessionResponse createClientResponse(UserSession userSession) {
        UserSessionResponse resp = mapper.map(userSession, UserSessionResponse.class);

        List<Workspace> lst = entityManager
                .createQuery("select uw.workspace from UserWorkspace uw where uw.user.id = :id")
                .setParameter("id", userSession.getUserId())
                .getResultList();

        List<SynchronizableItem> workspaces = new ArrayList<>();
        for (Workspace ws: lst) {
            SynchronizableItem item = mapper.map(ws, SynchronizableItem.class);
            workspaces.add(item);
        }

        resp.setWorkspaces(workspaces);

        return resp;
    }

    /**
     * Create the list of permissions granted to the user
     * @param uw instance of {@link UserWorkspace}
     * @return list of permissions in an array of String values
     */
    private List<String> createPermissionList(UserWorkspace uw) {
        List<String> lst = new ArrayList<>();

        for (UserProfile prof: uw.getProfiles()) {
            for (UserPermission up: prof.getPermissions()) {
                String permID = up.getPermission();
                Permission perm = permissions.find(permID);

                if (perm != null) {
                    lst.add(permID);

                    // can change ?
                    if (perm.isChangeable() && up.isCanChange()) {
                        lst.add(permID + "_EDT");
                    }
                }

            }
        }

        return lst;
    }


    /**
     * Return the information about the user in the workspace based on the given user and workspace objects
     * @param user instance of the {@link User} object
     * @param workspace instance of the {@link Workspace} object
     * @return instance of the {@link UserWorkspace} object
     */
    private UserWorkspace getUserWorkspace(User user, Workspace workspace) {
        List<UserWorkspace> lst = entityManager.createQuery("from UserWorkspace uw " +
                "join fetch uw.user join fetch uw.workspace where uw.user.id = :userid " +
                "and uw.workspace.id = :wsid")
                .setParameter("userid", user.getId())
                .setParameter("wsid", workspace.getId())
                .getResultList();

        if (lst.size() == 0) {
            return null;
        }

        return lst.get(0);
    }

}
