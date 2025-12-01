/**
 * CSV Exporter Module
 * Handles export of filtered service data to CSV format
 */

const CSVExporter = {
    /**
     * Escape CSV field according to RFC 4180
     * @param {*} value - The value to escape
     * @returns {string} Escaped CSV field
     */
    escapeCSVField(value) {
        if (value === null || value === undefined) {
            return '';
        }

        const stringValue = String(value);

        // Check if escaping is needed
        const needsEscaping = stringValue.includes(',') ||
                              stringValue.includes('"') ||
                              stringValue.includes('\n') ||
                              stringValue.includes('\r');

        if (!needsEscaping) {
            return stringValue;
        }

        // Escape double quotes by doubling them
        const escaped = stringValue.replace(/"/g, '""');

        // Wrap in double quotes
        return `"${escaped}"`;
    },

    /**
     * Generate CSV content from filtered data
     * @param {Array} filteredData - Array of service objects
     * @param {Array} categories - Array of category objects
     * @returns {string} CSV content
     */
    generateCSV(filteredData, categories) {
        // CSV Header row with localized headers
        const headers = [
            I18n.t('csvHeaderVendor'),
            I18n.t('csvHeaderServiceName'),
            I18n.t('csvHeaderCategory'),
            I18n.t('csvHeaderEolDate'),
            I18n.t('csvHeaderSupportEndDate'),
            I18n.t('csvHeaderStatus'),
            I18n.t('csvHeaderDaysUntilEol'),
            I18n.t('csvHeaderDescription'),
            I18n.t('csvHeaderOfficialUrl'),
            I18n.t('csvHeaderAlternatives')
        ];

        const rows = [headers.join(',')];

        // Data rows
        filteredData.forEach(service => {
            const categoryInfo = categories.find(c => c.id === service.category);
            const categoryName = categoryInfo ? categoryInfo.name : service.category;

            // Format alternatives as semicolon-separated list
            const alternatives = service.alternatives && service.alternatives.length > 0
                ? service.alternatives.map(alt => `${alt.serviceName} (${alt.url})`).join('; ')
                : '';

            const row = [
                this.escapeCSVField(service.vendor),
                this.escapeCSVField(service.serviceName),
                this.escapeCSVField(categoryName),
                this.escapeCSVField(I18n.formatDate(service.eolDate)),
                this.escapeCSVField(I18n.formatDate(service.supportEndDate)),
                this.escapeCSVField(I18n.getStatusLabel(service.computed.status)),
                this.escapeCSVField(service.computed.daysUntilEOL),
                this.escapeCSVField(service.description),
                this.escapeCSVField(service.officialUrl),
                this.escapeCSVField(alternatives)
            ];

            rows.push(row.join(','));
        });

        return rows.join('\n');
    },

    /**
     * Trigger CSV download
     * @param {Array} filteredData - Array of service objects to export
     * @param {Array} categories - Array of category objects
     */
    downloadCSV(filteredData, categories) {
        if (!filteredData || filteredData.length === 0) {
            console.warn('No data to export');
            return;
        }

        try {
            // Generate CSV content
            const csvContent = this.generateCSV(filteredData, categories);

            // Create blob with UTF-8 BOM for Excel compatibility
            const BOM = '\uFEFF';
            const blob = new Blob([BOM + csvContent], {
                type: 'text/csv;charset=utf-8;'
            });

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `eol-service-tracker-${timestamp}.csv`;

            // Create download link and trigger
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Failed to generate CSV:', error);
            alert(I18n.t('errorMessage'));
        }
    }
};

// Export to global scope
window.CSVExporter = CSVExporter;
