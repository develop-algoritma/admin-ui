const userLanguage = document.documentElement.lang;

module.exports = {

    props: {
        'action': {
            type: String,
            required: true
        },
        'default': {
            type: Object,
            default: function() {
                return {};
            }
        },
    },

    data: function() {
        return {
            form: this.default,
            datePickerConfig: {
                format: 'YYYY-MM-DD',
                altInput: true,
                altFormat: 'd.m.Y',
                locale: userLanguage === 'en' ? null : require("flatpickr/dist/l10n/"+userLanguage+".js")[userLanguage]
            },
            timePickerConfig: {
                enableTime: true,
                noCalendar: true,
                time_24hr: true,
                enableSeconds: true,
                format: 'kk:mm:ss',
                altInput: true,
                altFormat: 'H:i:S',
                locale: userLanguage === 'en' ? null : require("flatpickr/dist/l10n/"+userLanguage+".js")[userLanguage]
            },
            datetimePickerConfig: {
                enableTime: true,
                time_24hr: true,
                enableSeconds: true,
                format: 'YYYY-MM-DD kk:mm:ss',
                altInput: true,
                altFormat: 'd.m.Y H:i:S',
                locale: userLanguage === 'en' ? null : require("flatpickr/dist/l10n/"+userLanguage+".js")[userLanguage]
            }
        }
    },

    methods: {
        onSubmit() {
            return this.$validator.validateAll()
                .then(result => {
                    if (!result) {
                        return false;
                    }
                    axios.post(this.action, this.form)
                        .then(response => this.onSuccess(response.data))
                        .catch(errors => this.onFail(errors.response.data))
                });
        },
        onSuccess(data) {
            window.location.replace(data.redirect)
        },
        onFail(errors) {
            Object.keys(errors).map(key => this.$validator.errorBag.add(key, errors[key][0]));
        }
    }
};
