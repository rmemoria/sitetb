package org.msh.etbm.services.admin.cmdhisotryrep;

import org.msh.etbm.commons.date.DateUtils;
import org.msh.etbm.commons.entities.query.QueryBuilder;
import org.msh.etbm.commons.entities.query.QueryBuilderFactory;
import org.msh.etbm.commons.entities.query.QueryResult;
import org.msh.etbm.db.entities.CommandHistory;
import org.msh.etbm.db.entities.UserLogin;
import org.msh.etbm.services.admin.onlinereport.OnlineUsersRepService;
import org.msh.etbm.services.admin.onlinereport.OnlineUsersRepData;
import org.msh.etbm.services.usersession.UserRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by msantos on 9/3/16.
 */
@Service
public class CmdHistoryRepServiceImpl implements CmdHistoryRepService {

    @PersistenceContext
    EntityManager entityManager;

    @Autowired
    UserRequestService userRequestService;

    @Autowired
    QueryBuilderFactory queryBuilderFactory;

    public QueryResult getResult(CmdHistoryRepQueryParams query) {
        if (query.getIniDate() == null) {
            //TODOMS: retornar erro e validação
        }

        QueryResult<CmdHistoryRepData> ret = new QueryResult();

        QueryBuilder qry = queryBuilderFactory.createQueryBuilder(CommandHistory.class, "a");
        qry.addRestriction("a.workspace.id = :wId", userRequestService.getUserSession().getWorkspaceId());
        qry.addRestriction("a.execDate >= :iniDate", DateUtils.getDatePart(query.getIniDate()));
        qry.addRestriction("a.execDate < :endDate", query.getEndDate() != null ? DateUtils.getDatePart(DateUtils.incDays(query.getEndDate(), 1)) : null);
        qry.addRestriction("a.action = :action", query.getAction());
        qry.addRestriction("a.user.id = :userId", query.getUserId());
        qry.addRestriction("a.type = :type", query.getType());
        //qry.addRestriction("a.type = :type", query.getAdminUnitId()); TODOMS
        //qry.addRestriction("a.type = :type", query.getSearchKey()); TODOMS

        List<CommandHistory> list = qry.getResultList();
        ret.setList(new ArrayList<>());
        ret.setCount(list.size());

        for (CommandHistory c : list) {
            String userName = c.getUser() != null ? c.getUser().getName() : null;
            String unitName = c.getUnit() != null ? c.getUnit().getName() : null;
            String adminUnitName = c.getUnit() != null ? c.getUnit().getAddress().getAdminUnit().getFullDisplayName() : null;

            ret.getList().add(new CmdHistoryRepData(c.getType(), c.getAction(), c.getExecDate(), c.getEntityName(), userName, unitName, adminUnitName, c.getData()));
        }

        return ret;
    }
}