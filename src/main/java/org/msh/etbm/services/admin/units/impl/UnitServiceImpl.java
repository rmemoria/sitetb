package org.msh.etbm.services.admin.units.impl;


import org.msh.etbm.commons.ErrorMessages;
import org.msh.etbm.commons.entities.EntityServiceImpl;
import org.msh.etbm.commons.entities.query.QueryBuilder;
import org.msh.etbm.db.entities.AdministrativeUnit;
import org.msh.etbm.db.entities.Laboratory;
import org.msh.etbm.db.entities.Tbunit;
import org.msh.etbm.db.entities.Unit;
import org.msh.etbm.db.repositories.AdminUnitRepository;
import org.msh.etbm.services.admin.admunits.parents.AdminUnitSeriesService;
import org.msh.etbm.services.admin.units.UnitQueryParams;
import org.msh.etbm.services.admin.units.UnitService;
import org.msh.etbm.services.admin.units.UnitType;
import org.msh.etbm.services.admin.units.data.UnitData;
import org.msh.etbm.services.admin.units.data.UnitDetailedData;
import org.msh.etbm.services.admin.units.data.UnitFormData;
import org.msh.etbm.services.admin.units.data.UnitItemData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;

/**
 * CRUD service to handle units (laboratories and TB units)
 *
 * Created by rmemoria on 31/10/15.
 */
@Service
public class UnitServiceImpl extends EntityServiceImpl<Unit, UnitQueryParams> implements UnitService {

    @Autowired
    AdminUnitRepository adminUnitRepository;

    @Autowired
    AdminUnitSeriesService adminUnitSeriesService;

    @Override
    protected void buildQuery(QueryBuilder<Unit> builder, UnitQueryParams queryParams) {
        // determine the class to be used in the query
        Class clazz;
        if (queryParams.getType() != null) {
            clazz = queryParams.getType() == UnitType.TBUNIT ? Tbunit.class : Laboratory.class;
        } else {
            clazz = Unit.class;
        }
        builder.setEntityClass(clazz);
        builder.setEntityAlias("a");
        
        // add the available profiles
        builder.addProfile(UnitQueryParams.PROFILE_ITEM, UnitItemData.class);
        builder.addDefaultProfile(UnitQueryParams.PROFILE_DEFAULT, UnitData.class);
        builder.addProfile(UnitQueryParams.PROFILE_DETAILED, UnitDetailedData.class);

        // add the order by keys
        builder.addDefaultOrderByMap(UnitQueryParams.ORDERBY_NAME, "a.name");
        builder.addOrderByMap(UnitQueryParams.ORDERBY_ADMINUNIT, "a.adminUnit.name, a.name");
        builder.addOrderByMap(UnitQueryParams.ORDERBY_ADMINUNIT + " desc", "a.adminUnit.name desc, a.name desc");

        // check if workspace was set
        if (queryParams.getWorkspaceId() != null) {
            builder.setWorkspaceId(queryParams.getWorkspaceId());
        }

        // add the restrictions
        builder.addLikeRestriction("a.name", queryParams.getKey());

        builder.addRestriction("a.name = :name", queryParams.getName());

        // default to include just active items
        if (!queryParams.isIncludeDisabled()) {
            builder.addRestriction("a.active = true");
        }

        // restrictions administrative unit
        if (queryParams.getAdminUnitId() != null) {
            // include children?
            if (queryParams.isIncludeSubunits()) {
                AdministrativeUnit au = adminUnitRepository.findOne(queryParams.getAdminUnitId());

                // check if admin unit is of same workspace
                if (au == null || !au.getWorkspace().getId().equals(builder.getWorkspaceId())) {
                    rejectFieldException(queryParams, "adminUnitId", "Invalid administrative unit");
                }
                // search for all administrative units
                builder.addRestriction("a.address.adminUnit.code like :code", au.getCode() + "%");
            } else {
                // search for units directly registered in this administrative unit
                builder.addRestriction("a.address.adminUnit.id = :auid", queryParams.getAdminUnitId());
            }
        }

        // laboratory filters
        builder.addRestriction("performCulture = :pefculture", queryParams.getPerformCulture());
        builder.addRestriction("performMicroscopy = :pefmic", queryParams.getPerformMicroscopy());
        builder.addRestriction("performDst = :pefdst", queryParams.getPerformDst());
        builder.addRestriction("performXpert = :pefxpert", queryParams.getPerformXpert());

        // TB unit filters
        builder.addRestriction("tbFacility = :tbfacility", queryParams.getTbFacility());
        builder.addRestriction("mdrFacility = :mdrfacility", queryParams.getMdrFacility());
        builder.addRestriction("ntmFacility = :ntmfacility", queryParams.getNtmFacility());
        builder.addRestriction("notificationUnit = :notifunit", queryParams.getNotificationUnit());
    }


    @Override
    protected Unit createEntityInstance(Object req) {
        UnitFormData ureq = (UnitFormData)req;

        if (ureq.getType() == null) {
            raiseRequiredFieldException(req, "type");
        }

        switch (ureq.getUnitType()) {
            case LAB: return new Laboratory();
            case TBUNIT: return new Tbunit();
        }

        rejectFieldException(req, "type", "InvalidValue");
        return null;
    }

    @Override
    protected void beforeSave(Unit entity, Errors errors) {
        if (entity.getAddress() == null) {
            errors.rejectValue("address", ErrorMessages.REQUIRED);
        } else if (entity.getAddress().getAdminUnit() == null) {
            errors.rejectValue("address.adminUnit", ErrorMessages.REQUIRED);
        }
    }
}
