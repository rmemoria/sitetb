package org.msh.etbm.services.admin.cmdhisotryrep;

import org.msh.etbm.services.admin.onlinereport.OnlineUsersRepData;

import java.util.List;

/**
 * Created by msantos on 15/3/16.
 */
public interface CmdHistoryRepService {
    List<OnlineUsersRepData> getResult(CmdHistoryRepQueryParams query);
}
