// utils/formatters.ts

/**
 * Formats a RUN/RUT adding dots and dash.
 * Example: 123456789 -> 12.345.678-9
 */
export const formatRut = (value: string): string => {
    // 1. Clean: allow only numbers and k/K
    const clean = value.replace(/[^0-9kK]/g, '');
    if (!clean) return '';

    // 2. Limit length (approx 9 digits for body + 1 for dv)
    const limited = clean.slice(0, 9); // Chile max is usually around 8-9 digits total

    if (limited.length < 2) return limited;

    // 3. Separate body and DV
    const body = limited.slice(0, -1);
    const dv = limited.slice(-1).toUpperCase();

    // 4. Format body
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${formattedBody}-${dv}`;
};
