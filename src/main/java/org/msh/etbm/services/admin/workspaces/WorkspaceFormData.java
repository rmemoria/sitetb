package org.msh.etbm.services.admin.workspaces;

import org.msh.etbm.db.enums.CaseValidationOption;
import org.msh.etbm.db.enums.DisplayCaseNumber;
import org.msh.etbm.db.enums.NameComposition;
import org.msh.etbm.db.enums.TreatMonitoringInput;

import java.util.Optional;

/**
 * Data to be used in a form editor in the client side
 * <p>
 * Created by rmemoria on 9/4/16.
 */
public class WorkspaceFormData {

    private Optional<String> name;
    private Optional<Boolean> sendSystemMessages;

    private Optional<NameComposition> patientNameComposition;
    private Optional<TreatMonitoringInput> treatMonitoringInput;

    private Optional<DisplayCaseNumber> suspectCaseNumber;
    private Optional<DisplayCaseNumber> confirmedCaseNumber;

    private Optional<CaseValidationOption> caseValidationTB;
    private Optional<CaseValidationOption> caseValidationDRTB;
    private Optional<CaseValidationOption> caseValidationNTM;

    private Optional<Integer> monthsToAlertExpiredMedicines;
    private Optional<Integer> minStockOnHand;
    private Optional<Integer> maxStockOnHand;

    public Optional<String> getName() {
        return name;
    }

    public void setName(Optional<String> name) {
        this.name = name;
    }

    public Optional<Boolean> getSendSystemMessages() {
        return sendSystemMessages;
    }

    public void setSendSystemMessages(Optional<Boolean> sendSystemMessages) {
        this.sendSystemMessages = sendSystemMessages;
    }

    public Optional<NameComposition> getPatientNameComposition() {
        return patientNameComposition;
    }

    public void setPatientNameComposition(Optional<NameComposition> patientNameComposition) {
        this.patientNameComposition = patientNameComposition;
    }

    public Optional<TreatMonitoringInput> getTreatMonitoringInput() {
        return treatMonitoringInput;
    }

    public void setTreatMonitoringInput(Optional<TreatMonitoringInput> treatMonitoringInput) {
        this.treatMonitoringInput = treatMonitoringInput;
    }

    public Optional<DisplayCaseNumber> getSuspectCaseNumber() {
        return suspectCaseNumber;
    }

    public void setSuspectCaseNumber(Optional<DisplayCaseNumber> suspectCaseNumber) {
        this.suspectCaseNumber = suspectCaseNumber;
    }

    public Optional<DisplayCaseNumber> getConfirmedCaseNumber() {
        return confirmedCaseNumber;
    }

    public void setConfirmedCaseNumber(Optional<DisplayCaseNumber> confirmedCaseNumber) {
        this.confirmedCaseNumber = confirmedCaseNumber;
    }

    public Optional<CaseValidationOption> getCaseValidationTB() {
        return caseValidationTB;
    }

    public void setCaseValidationTB(Optional<CaseValidationOption> caseValidationTB) {
        this.caseValidationTB = caseValidationTB;
    }

    public Optional<CaseValidationOption> getCaseValidationDRTB() {
        return caseValidationDRTB;
    }

    public void setCaseValidationDRTB(Optional<CaseValidationOption> caseValidationDRTB) {
        this.caseValidationDRTB = caseValidationDRTB;
    }

    public Optional<CaseValidationOption> getCaseValidationNTM() {
        return caseValidationNTM;
    }

    public void setCaseValidationNTM(Optional<CaseValidationOption> caseValidationNTM) {
        this.caseValidationNTM = caseValidationNTM;
    }

    public Optional<Integer> getMonthsToAlertExpiredMedicines() {
        return monthsToAlertExpiredMedicines;
    }

    public void setMonthsToAlertExpiredMedicines(Optional<Integer> monthsToAlertExpiredMedicines) {
        this.monthsToAlertExpiredMedicines = monthsToAlertExpiredMedicines;
    }

    public Optional<Integer> getMinStockOnHand() {
        return minStockOnHand;
    }

    public void setMinStockOnHand(Optional<Integer> minStockOnHand) {
        this.minStockOnHand = minStockOnHand;
    }

    public Optional<Integer> getMaxStockOnHand() {
        return maxStockOnHand;
    }

    public void setMaxStockOnHand(Optional<Integer> maxStockOnHand) {
        this.maxStockOnHand = maxStockOnHand;
    }
}
