/**
 * Internationalization (i18n) Module
 * Supports English and Japanese
 */

const I18n = {
    currentLanguage: 'en',

    translations: {
        en: {
            // Header
            title: 'Cloud Service EOL Tracker',
            subtitle: 'Stay informed about cloud service deprecations and end-of-life dates',

            // Search and Filters
            searchPlaceholder: 'Search services...',
            allVendors: 'All Vendors',
            allCategories: 'All Categories',
            upcomingOnly: 'Upcoming EOL Only',
            allTime: 'All Time',
            alreadyEOL: 'Already EOL',
            next30Days: 'Next 30 days',
            next90Days: 'Next 90 days',
            next6Months: 'Next 6 months',
            nextYear: 'Next year',

            // Sort Options
            sortEOLSoon: 'EOL Date (Soon first)',
            sortEOLLate: 'EOL Date (Latest first)',
            sortNameAZ: 'Service Name (A-Z)',
            sortNameZA: 'Service Name (Z-A)',
            sortVendor: 'Vendor (A-Z)',

            // View Toggle
            tableView: 'Table View',
            cardView: 'Card View',

            // States
            loading: 'Loading cloud service data...',
            errorMessage: 'Failed to load data. Please try again later.',
            emptyMessage: 'No services match your filters. Try adjusting your search criteria.',

            // Footer
            dataLastUpdated: 'Data last updated',
            disclaimerTitle: 'Disclaimer',
            disclaimerAccuracy: 'This information may contain errors. Please verify with official sources before making decisions.',
            disclaimerNoWarranty: 'This information is provided "as is" without warranty of any kind, either expressed or implied.',
            disclaimerNoSLA: 'No Service Level Agreement (SLA) or guarantee of accuracy, completeness, or timeliness is provided.',
            disclaimerTrademarks: 'All trademarks, service marks, and company names are the property of their respective owners.',
            disclaimerLiability: 'The authors and contributors are not liable for any damages arising from the use of this information.',
            downloadJson: 'Download JSON Data',
            githubContribute: 'Contribute on GitHub',
            reportIssue: 'Found an error? Report an issue or submit a PR',

            // Card/Table Content
            eolDate: 'EOL Date',
            timeUntilEOL: 'Time Until EOL',
            supportEndDate: 'Support End Date',
            officialAnnouncement: 'Official Announcement',
            alternatives: 'Alternatives',
            vendor: 'Vendor',
            serviceName: 'Service Name',
            category: 'Category',
            status: 'Status',
            officialLink: 'Official Link',

            // Status Labels
            statusEOL: 'EOL',
            statusEndingSoon: 'Ending Soon',
            statusActive: 'Active',

            // Date Formatting
            daysAgo: '{days} days ago',
            today: 'Today',
            tomorrow: 'Tomorrow',
            days: '{days} days',
            month: '{months} month',
            months: '{months} months',
            year: '{years} year',
            years: '{years} years',
            unknown: 'Unknown',
            notAvailable: 'N/A',

            // Result Count
            servicesCount: '{count} of {total} services',
            lastUpdated: 'Last updated: {date}'
        },
        ja: {
            // ヘッダー
            title: 'クラウドサービスEOLトラッカー',
            subtitle: 'クラウドサービスの廃止予定とサポート終了日を確認',

            // 検索とフィルター
            searchPlaceholder: 'サービスを検索...',
            allVendors: 'すべてのベンダー',
            allCategories: 'すべてのカテゴリ',
            upcomingOnly: '予定のみ表示',
            allTime: 'すべての期間',
            alreadyEOL: 'すでにEOL',
            next30Days: '今後30日',
            next90Days: '今後90日',
            next6Months: '今後6ヶ月',
            nextYear: '今後1年',

            // ソートオプション
            sortEOLSoon: 'EOL日（近い順）',
            sortEOLLate: 'EOL日（遠い順）',
            sortNameAZ: 'サービス名（A-Z）',
            sortNameZA: 'サービス名（Z-A）',
            sortVendor: 'ベンダー（A-Z）',

            // 表示切替
            tableView: 'テーブル表示',
            cardView: 'カード表示',

            // 状態
            loading: 'データを読み込んでいます...',
            errorMessage: 'データの読み込みに失敗しました。後でもう一度お試しください。',
            emptyMessage: 'フィルター条件に一致するサービスがありません。検索条件を調整してください。',

            // フッター
            dataLastUpdated: 'データ最終更新',
            disclaimerTitle: '免責事項',
            disclaimerAccuracy: 'この情報には誤りが含まれる可能性があります。判断する前に必ず公式情報をご確認ください。',
            disclaimerNoWarranty: 'この情報は「現状のまま」提供されており、明示的または黙示的を問わず、いかなる保証も行いません。',
            disclaimerNoSLA: '正確性、完全性、適時性に関するサービスレベル契約（SLA）や保証は提供されません。',
            disclaimerTrademarks: 'すべての商標、サービスマーク、企業名は各所有者に帰属します。',
            disclaimerLiability: '本情報の利用により生じたいかなる損害についても、作成者および貢献者は責任を負いません。',
            downloadJson: 'JSONデータをダウンロード',
            githubContribute: 'GitHubで貢献する',
            reportIssue: '誤りを見つけましたか？Issueまたはプルリクエストをお願いします',

            // カード/テーブルコンテンツ
            eolDate: 'EOL日',
            timeUntilEOL: 'EOLまでの期間',
            supportEndDate: 'サポート終了日',
            officialAnnouncement: '公式発表',
            alternatives: '代替サービス',
            vendor: 'ベンダー',
            serviceName: 'サービス名',
            category: 'カテゴリ',
            status: 'ステータス',
            officialLink: '公式リンク',

            // ステータスラベル
            statusEOL: 'サポート終了',
            statusEndingSoon: '終了予定',
            statusActive: '稼働中',

            // 日付フォーマット
            daysAgo: '{days}日前',
            today: '今日',
            tomorrow: '明日',
            days: '{days}日',
            month: '{months}ヶ月',
            months: '{months}ヶ月',
            year: '{years}年',
            years: '{years}年',
            unknown: '不明',
            notAvailable: 'N/A',

            // 結果数
            servicesCount: '{total}件中{count}件のサービス',
            lastUpdated: '最終更新: {date}'
        }
    },

    /**
     * Initialize i18n
     */
    init() {
        // Try to get language from localStorage or browser
        const savedLang = localStorage.getItem('language');
        const browserLang = navigator.language.split('-')[0];

        if (savedLang && this.translations[savedLang]) {
            this.currentLanguage = savedLang;
        } else if (browserLang === 'ja') {
            this.currentLanguage = 'ja';
        }

        this.applyTranslations();
        this.updateLanguageButton();
    },

    /**
     * Switch language
     */
    switchLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'ja' : 'en';
        localStorage.setItem('language', this.currentLanguage);
        this.applyTranslations();
        this.updateLanguageButton();

        // Trigger event for app to update dynamic content
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    },

    /**
     * Get translation for a key
     * @param {string} key - Translation key
     * @param {Object} params - Parameters to replace in translation
     * @returns {string} Translated text
     */
    t(key, params = {}) {
        let text = this.translations[this.currentLanguage][key] || this.translations.en[key] || key;

        // Replace parameters
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });

        return text;
    },

    /**
     * Apply translations to all elements with data-i18n attribute
     */
    applyTranslations() {
        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    },

    /**
     * Update language toggle button
     */
    updateLanguageButton() {
        const langButton = document.getElementById('language-toggle');
        if (langButton) {
            const langText = langButton.querySelector('.lang-text');
            if (langText) {
                langText.textContent = this.currentLanguage === 'en' ? '日本語' : 'English';
            }
        }
    },

    /**
     * Format date based on current language
     * @param {string|Date} date - Date to format
     * @returns {string} Formatted date
     */
    formatDate(date) {
        if (!date) return this.t('notAvailable');

        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const locale = this.currentLanguage === 'ja' ? 'ja-JP' : 'en-US';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };

        return dateObj.toLocaleDateString(locale, options);
    },

    /**
     * Get time until EOL in human-readable format
     * @param {number} days - Days until EOL
     * @returns {string} Human-readable string
     */
    getTimeUntilEOL(days) {
        if (days === null) return this.t('unknown');
        if (days < 0) return this.t('daysAgo', { days: Math.abs(days) });
        if (days === 0) return this.t('today');
        if (days === 1) return this.t('tomorrow');
        if (days <= 30) return this.t('days', { days });
        if (days <= 60) return this.t(days <= 30 ? 'month' : 'months', { months: Math.floor(days / 30) });
        if (days <= 365) return this.t('months', { months: Math.floor(days / 30) });

        const years = Math.floor(days / 365);
        return this.t(years === 1 ? 'year' : 'years', { years });
    },

    /**
     * Get status label
     * @param {string} status - Status code
     * @returns {string} Localized status label
     */
    getStatusLabel(status) {
        const statusKeys = {
            'eol': 'statusEOL',
            'deprecated': 'statusEndingSoon',
            'active': 'statusActive'
        };

        return this.t(statusKeys[status] || 'unknown');
    }
};

// Initialize i18n when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => I18n.init());
} else {
    I18n.init();
}

// Make I18n available globally
window.I18n = I18n;
