package org.msh.etbm.services.cases.followup.data;

/**
 * Created by Mauricio on 07/07/2016.
 */
public enum FollowUpType {

    MEDICAL_EXAMINATION("MedicalExamination", "org.msh.etbm.services.cases.followup.medexam.MedExamData"),
    EXAM_MICROSCOPY("ExamMicroscopy", "org.msh.etbm.services.cases.followup.exammic.ExamMicData"),
    EXAM_CULTURE("ExamCulture", ""),
    EXAM_XPERT("ExamXpert", ""),
    EXAM_DST("ExamDST", ""),
    EXAM_XRAY("ExamXRay", ""),
    EXAM_HIV("ExamHIV", "");

    FollowUpType(String entityClassName, String dataClassCanonicalName) {
        this.entityClassName = entityClassName;
        this.dataClassCanonicalName = dataClassCanonicalName;
    }

    String entityClassName;
    String dataClassCanonicalName;

    public String getEntityClassName() {
        return entityClassName;
    }

    public String getDataClassCanonicalName() {
        return dataClassCanonicalName;
    }

    public String getKey() {
        return getClass().getSimpleName().concat("." + name());
    }
}