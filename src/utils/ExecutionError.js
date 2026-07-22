class ExecutionError extends Error {
    constructor(type, message, details = null) {
        super(message);

        this.name = "ExecutionError";
        this.type = type;
        this.details = details;
    }
}

export default ExecutionError;