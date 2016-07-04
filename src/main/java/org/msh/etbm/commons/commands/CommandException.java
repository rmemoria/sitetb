package org.msh.etbm.commons.commands;

/**
 * Exception generated by command execution
 * Created by rmemoria on 17/10/15.
 */
public class CommandException extends RuntimeException {

    /**
     * Standard constructor
     */
    public CommandException() {
        super();
    }

    /**
     * Constructor passing a message to be displayed to the user
     *
     * @param message
     */
    public CommandException(String message) {
        super(message);
    }

    /**
     * Command exception created from another exception
     *
     * @param message the message
     * @param cause   the cause
     */
    public CommandException(String message, Throwable cause) {
        super(message, cause);
    }

    public CommandException(Throwable cause) {
        super(cause);
    }

    public CommandException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}