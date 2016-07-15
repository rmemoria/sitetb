package org.msh.etbm.commons.entities.query;

import java.util.List;

/**
 * Standard result of entity queries
 * <p>
 * Created by rmemoria on 28/10/15.
 */
public class QueryResult<E> {
    /**
     * Number of entities found
     */
    private long count;

    /**
     * List of entities returned
     */
    private List<E> list;

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public List<E> getList() {
        return list;
    }

    public void setList(List<E> list) {
        this.list = list;
    }
}
