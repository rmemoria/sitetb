package org.msh.etbm.services.cases.view.unitview;

import org.msh.etbm.commons.Item;
import org.msh.etbm.commons.Messages;
import org.msh.etbm.commons.date.Period;
import org.msh.etbm.commons.objutils.ObjectUtils;
import org.msh.etbm.db.entities.*;
import org.msh.etbm.db.enums.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Service that returns the data to create the unit view of the case management module
 * Created by rmemoria on 3/6/16.
 */
@Service
public class UnitViewService {

    @PersistenceContext
    EntityManager entityManager;

    @Autowired
    Messages messages;


    /**
     * Get data related to the unit view of the cases module
     *
     * @param unitId the unit ID to get information from
     * @return instance of {@link UnitViewData} containing the unit data
     */
    @Transactional
    public UnitViewData getUnitView(UUID unitId) {
        UnitViewData data = new UnitViewData();

        loadCases(unitId, data);

        return data;
    }

    /**
     * Load the cases to load into unit view
     *
     * @param unitId the unit ID to get the cases from
     * @param data   the data to receive the cases
     */
    private void loadCases(UUID unitId, UnitViewData data) {
        List<TbCase> lst = entityManager.createQuery("from TbCase c " +
                "join fetch c.patient where (c.ownerUnit.id = :unitId or c.transferOutUnit = :unitId) " +
                "and c.state in (:st1, :st2) " +
                "order by c.patient.name.name")
                .setParameter("unitId", unitId)
                .setParameter("st1", CaseState.ONTREATMENT)
                .setParameter("st2", CaseState.NOT_ONTREATMENT)
                .getResultList();

        data.setPresumptives(new ArrayList<>());
        data.setDrtbCases(new ArrayList<>());
        data.setTbCases(new ArrayList<>());
        data.setNtmCases(new ArrayList<>());

        for (TbCase tbcase : lst) {

            // is a case a presumptive one?
            if (tbcase.getDiagnosisType() == DiagnosisType.SUSPECT) {
                data.getPresumptives().add(createPresumptiveData(tbcase));
            } else {
                // get confirmed case data
                ConfirmedCaseData caseData = createConfirmedData(tbcase);

                switch (tbcase.getClassification()) {
                    case DRTB: data.getDrtbCases().add(caseData);
                        break;
                    case NTM: data.getNtmCases().add(caseData);
                        break;
                    default: data.getTbCases().add(caseData);
                }
            }
        }
    }

    private PresumptiveCaseData createPresumptiveData(TbCase tbcase) {
        PresumptiveCaseData data = createCaseData(tbcase, PresumptiveCaseData.class);

        data.setCaseNumber(tbcase.getRegistrationNumber());

        List<ExamMicroscopy> micList = tbcase.getExamsMicroscopy();
        if (micList != null && micList.size() > 0) {
            // get the last exam microscopy
            ExamMicroscopy examMic = micList.get(micList.size() - 1);
            data.setMicroscopyResult(new Item<>(examMic.getResult(), messages.get(examMic.getResult().getMessageKey())));
        }

        List<ExamXpert> xpertList = tbcase.getExamsXpert();
        if (xpertList != null && xpertList.size() > 0) {
            // get the last exam microscopy
            ExamXpert examXpert = xpertList.get(xpertList.size() - 1);
            data.setXpertResult(new Item<>(examXpert.getResult(), messages.get(examXpert.getResult().getMessageKey())));
        }

        return data;
    }

    private ConfirmedCaseData createConfirmedData(TbCase tbcase) {
        ConfirmedCaseData data = createCaseData(tbcase, ConfirmedCaseData.class);

        data.setCaseNumber(tbcase.getCaseNumber());
        if (tbcase.getInfectionSite() != null) {
            data.setInfectionSite(new Item(tbcase.getInfectionSite(), messages.get(tbcase.getInfectionSite().getMessageKey())));
        }
        data.setRegistrationGroup(tbcase.getRegistrationGroup());

        // is case on treatment ?
        if (tbcase.isOnTreatment()) {
            data.setIniTreatmentDate(tbcase.getTreatmentPeriod().getIniDate());

            // calculate the treatment progress based on the current date
            Period p = new Period(tbcase.getTreatmentPeriod().getIniDate(), new Date());

            int daysTreatment = tbcase.getTreatmentPeriod().getDays();

            int prog = daysTreatment > 0 ? (p.getDays() * 100) / daysTreatment * 100 : 0;

            // limit in case the treatment should have finished
            if (prog > 100) {
                prog = 100;
            }

            data.setTreatmentProgress(prog);
        }

        return data;
    }

    /**
     * Presumptive and confirmed share common information. This method creates the data object
     * to store data about a confirmed or a presumptive case
     *
     * @param tbcase the TB case data
     * @param clazz  data class to be instantiated, inherited from {@link CommonCaseData}
     * @param <K>
     * @return the instance of the data class, with common data filled
     */
    private <K extends CommonCaseData> K createCaseData(TbCase tbcase, Class<K> clazz) {
        K data = ObjectUtils.newInstance(clazz);

        Patient p = tbcase.getPatient();

        data.setId(tbcase.getId());
        data.setName(p.getName());
        data.setGender(p.getGender());
        data.setRegistrationDate(tbcase.getRegistrationDate());

        return data;
    }
}
