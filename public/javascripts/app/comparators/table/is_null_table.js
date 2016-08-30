/**
 * Created by AGromov on 23.08.2016.
 */

define([], function() {
    return {
        validationMessage: "Table became null",
        severity: "danger",
        compare: function(tables) {
            var basicTable = tables[0],
                val = basicTable.rows > 0,
                result = true;
            if(val == false) {
                return true;
            }
            tables.forEach((table) => {
                if(table.rows != val) {
                    result = false;
                }
            });

            return result;
        }
    };
});
