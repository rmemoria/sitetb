package org.msh.etbm.services.cases.followup.examxpert;

import org.msh.etbm.Messages;
import org.msh.etbm.commons.commands.CommandTypes;
import org.msh.etbm.commons.entities.EntityServiceImpl;
import org.msh.etbm.commons.entities.query.EntityQueryParams;
import org.msh.etbm.db.entities.ExamDST;
import org.msh.etbm.db.entities.ExamXpert;
import org.msh.etbm.db.enums.ExamStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;

/**
 * Created by msantos on 14/7/16.
 */
@Service
public class ExamXpertServiceImpl extends EntityServiceImpl<ExamXpert, EntityQueryParams> implements ExamXpertService {

    @Autowired
    Messages messages;

    @Override
    public String getCommandType() {
        return CommandTypes.CASES_EXAM_XPERT;
    }

    @Override
    protected void beforeSave(ExamXpert entity, Errors errors) {
        if (entity.getDateRelease() != null && entity.getDateRelease().before(entity.getDate())) {
            errors.rejectValue("dateRelease", messages.get("cases.exams.datereleasebeforecol"));
        }

        entity.setStatus(ExamStatus.PERFORMED);
    }

}