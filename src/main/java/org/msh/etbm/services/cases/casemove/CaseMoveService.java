package org.msh.etbm.services.cases.casemove;

import org.msh.etbm.commons.date.DateUtils;
import org.msh.etbm.commons.date.Period;
import org.msh.etbm.commons.entities.EntityValidationException;
import org.msh.etbm.commons.entities.ServiceResult;
import org.msh.etbm.db.entities.*;
import org.msh.etbm.db.enums.CaseState;
import org.msh.etbm.services.cases.treatment.TreatmentService;
import org.msh.etbm.services.session.usersession.UserRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Created by Mauricio on 12/09/2016.
 */
@Service
public class CaseMoveService {
    @PersistenceContext
    EntityManager entityManager;

    @Autowired
    TreatmentService treatmentService;

    @Autowired
    UserRequestService userRequestService;

    @Autowired
    OnTreatCaseMoveService onTreatCaseMoveService;

    @Autowired
    NotOnTreatCaseMoveService notOnTreatCaseMoveService;

    // TODO: [MSANTOS] Missing implementation of commandlog
    // TODO: [MSANTOS] Missing implementation of ownerunit selection
    // TODO: [MSANTOS] Missing email dispatcher implementation
    // TODO: [MSANTOS] Prepare this flush to allow transfer for cases on NOT_ON_TREATMENT state

    public ServiceResult transferOut(CaseMoveRequest req) {
        TbCase tbcase = entityManager.find(TbCase.class, req.getTbcaseId());
        Unit unitTo = entityManager.find(Unit.class, req.getUnitToId());

        if (tbcase == null) {
            throw new EntityNotFoundException();
        }

        if (!(unitTo instanceof Tbunit)) {
            throw new EntityValidationException(unitTo, "DISCRIMINATOR", "Destiny unit must be a TbUnit", null);
        }

        if (unitTo == null) {
            throw new EntityNotFoundException();
        }

        if (tbcase.getState().equals(CaseState.ONTREATMENT)) {
            return onTreatCaseMoveService.transferOut(req);
        } else if (tbcase.getState().equals(CaseState.ONTREATMENT)) {
            return notOnTreatCaseMoveService.transferOut(req);
        }

        throw new EntityValidationException(tbcase, "state", "Closed cases can't be transfered", null);
    }
}
