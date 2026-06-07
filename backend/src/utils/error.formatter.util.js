export const formatError = (error) => {
    if (error.message && error.message.startsWith("[\n")) {
        try {
            const zodErrors = JSON.parse(error.message);
            return {
                statusCode: 400,
                body: {
                    message: "Validasi gagal",
                    errors: zodErrors.map((err) => ({
                        field: err.path && err.path.length > 0 ? err.path[0] : "unknown",
                        message: err.message,
                    })),
                },
            };
        } catch (e) {}
    }

    if (error && Array.isArray(error.errors)) {
        return {
            statusCode: 400,
            body: {
                message: "Validasi gagal",
                errors: error.errors.map((err) => ({
                    field: err.path && err.path.length > 0 ? err.path[0] : "unknown",
                    message: err.message,
                })),
            },
        };
    }

    const statusCode = error.statusCode || error.status || 500;
    console.error("Error:", error.message || error);

    if (error.isOperational) {
        return {
            statusCode: error.statusCode || 400,
            body: {
                message: error.message,
                errors: [],
            },
        };
    }

    return {
        statusCode,
        body: {
            message: "Terjadi kesalahan pada server",
            errors: [],
        },
    };
};
