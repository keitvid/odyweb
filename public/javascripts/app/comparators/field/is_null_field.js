/**
 * Created by AGromov on 23.08.2016.
 */

define([], function() {
    return {
        validationMessage: "Table became null",
        compare: function(fields) {
            var basicField = fields[0],
                val = this.checkVal(basicField),
                result = true;

            fields.forEach((field) => {
                if(val != this.checkVal(field)) {
                    result = false;
                }
            });

            return result;
        },

        checkVal: function(field) {
            return field.metrics.filter((item) => {
                    return item.title == "Nulls Rate";
                })[0] === "100%"
        }
    };
});