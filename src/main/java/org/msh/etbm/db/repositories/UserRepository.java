package org.msh.etbm.db.repositories;

import org.msh.etbm.db.entities.User;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

/**
 * Created by rmemoria on 10/10/15.
 */
public interface UserRepository extends CrudRepository<User, UUID> {
}
