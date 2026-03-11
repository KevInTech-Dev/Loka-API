export const generateIvoiceNumber = (lastInvNumber?: string): string => {
    const prefix = "FAC";
    const currentYear = new Date().getFullYear();
    let nextNumber = 1;

    if (lastInvNumber) {
        const parts = lastInvNumber.split("-");
        const lastYear = parseInt(parts[1], 10);
        const lastNumber = parseInt(parts[2], 10);

        if (lastYear === currentYear) {
            nextNumber = lastNumber + 1;
        }
    }

    const paddedNumber = String(nextNumber).padStart(3, "0");

    return `${prefix}-${currentYear}-${paddedNumber}`;
}


