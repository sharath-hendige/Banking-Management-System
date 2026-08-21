//package com.sharath.banking_management_system.exception;
//
//public class InsufficientBalanceException extends RuntimeException {
//
//    /**
//	 * 
//	 */
//	private static final long serialVersionUID = 1L;
//
//	public InsufficientBalanceException(String message) {
//        super(message);
//    }
//}

package com.sharath.banking_management_system.exception;

public class InsufficientBalanceException extends RuntimeException {

    public InsufficientBalanceException(String message) {
        super(message);
    }
}