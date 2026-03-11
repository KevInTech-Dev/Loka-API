export const generateIvoiceNumber = (lastInvNumber?: number): string => {
    const prefix = "FAC";
    const currentYear = new Date().getFullYear();

    if (lastInvNumber) {
        const nextNumber = lastInvNumber + 1;
        const paddedNumber = String(nextNumber).padStart(3, "0");
        return `${prefix}-${currentYear}-${paddedNumber}`;
    } else {
        throw new Error("Please verify your last invoice number")
    }
}


