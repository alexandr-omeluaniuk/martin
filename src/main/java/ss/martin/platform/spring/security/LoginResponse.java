/*
 * Copyright (C) 2018 Wisent Media
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package ss.martin.platform.spring.security;

/**
 * HTTP response.
 * @author Alexandr Omeluaniuk
 */
public class LoginResponse {
    /** Is success. */
    private boolean success;
    /** Message for client. */
    private String message;
    /** Error code (custom). */
    private String code;
    /** Details. */
    private String details;
    /** Stacktrace. */
    private String stacktrace;
    /**
     * Constructor.
     * @param success is success.
     * @param message message.
     */
    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    /**
     * @return the success
     */
    public boolean isSuccess() {
        return success;
    }
    /**
     * @param success the success to set
     */
    public void setSuccess(boolean success) {
        this.success = success;
    }
    /**
     * @return the message
     */
    public String getMessage() {
        return message;
    }
    /**
     * @param message the message to set
     */
    public void setMessage(String message) {
        this.message = message;
    }
    /**
     * @return the code
     */
    public String getCode() {
        return code;
    }
    /**
     * @param code the code to set
     */
    public void setCode(String code) {
        this.code = code;
    }
    /**
     * @return the details
     */
    public String getDetails() {
        return details;
    }
    /**
     * @param details the details to set
     */
    public void setDetails(String details) {
        this.details = details;
    }
    /**
     * @return the stacktrace
     */
    public String getStacktrace() {
        return stacktrace;
    }
    /**
     * @param stacktrace the stacktrace to set
     */
    public void setStacktrace(String stacktrace) {
        this.stacktrace = stacktrace;
    }
}
